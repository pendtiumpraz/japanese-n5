/**
 * Canvas Stroke Trainer (M2-ready, dipakai awal untuk kana sederhana)
 * Fitur:
 * - Render grid canvas responsif
 * - Gambar contoh stroke path sederhana (placeholder untuk kana)
 * - Mode trace: user menggambar; penilaian kasar berdasarkan jarak ke path target
 *
 * Catatan:
 * - Untuk M1 kita siapkan util & komponen dasar agar mudah integrasi nanti.
 * - Data stroke detail kana/kanji akan ditambahkan bertahap (M2/M5).
 */

const PX_RATIO = (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

// Util: buat canvas high-DPI
export function createHiDPICanvas(width, height) {
  const c = document.createElement('canvas');
  c.style.width = width + 'px';
  c.style.height = height + 'px';
  c.width = Math.floor(width * PX_RATIO);
  c.height = Math.floor(height * PX_RATIO);
  const g = c.getContext('2d');
  g.setTransform(PX_RATIO, 0, 0, PX_RATIO, 0, 0);
  return c;
}

// StrokeTrainer: kelas sederhana
export class StrokeTrainer {
  constructor({ width = 320, height = 320, strokeColor = '#1d4ed8', guideColor = '#94a3b8', target = [] } = {}) {
    this.width = width;
    this.height = height;
    this.strokeColor = strokeColor;
    this.guideColor = guideColor;
    // target: array of strokes, each stroke is array of points [{x,y},...]
    this.target = target;
    this.userStrokes = [];
    this.currentStroke = null;
    this.onScore = null;
    this.el = null;
  }

  mount(container) {
    const wrap = typeof container === 'string' ? document.querySelector(container) : container;
    if (!wrap) return;
    const canvas = createHiDPICanvas(this.width, this.height);
    canvas.className = 'card';
    canvas.style.touchAction = 'none';
    wrap.innerHTML = '';
    wrap.appendChild(canvas);
    this.el = canvas;
    this.ctx = canvas.getContext('2d');

    this.drawGrid();
    this.drawTargetGuide();

    // Events
    const start = (x, y) => {
      this.currentStroke = [{ x, y }];
    };
    const move = (x, y) => {
      if (!this.currentStroke) return;
      const last = this.currentStroke[this.currentStroke.length - 1];
      if (Math.hypot(x - last.x, y - last.y) > 1.5) {
        this.currentStroke.push({ x, y });
        this.redraw();
      }
    };
    const end = () => {
      if (this.currentStroke && this.currentStroke.length > 1) {
        this.userStrokes.push(this.currentStroke);
      }
      this.currentStroke = null;
      this.score();
    };

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX; clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX; clientY = e.clientY;
      }
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    canvas.addEventListener('mousedown', (e) => { const p = getPos(e); start(p.x, p.y); });
    canvas.addEventListener('mousemove', (e) => { const p = getPos(e); move(p.x, p.y); });
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('mouseleave', end);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); const p = getPos(e); start(p.x, p.y); });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); const p = getPos(e); move(p.x, p.y); });
    canvas.addEventListener('touchend', (e) => { e.preventDefault(); end(); });

    this.redraw();
  }

  reset() {
    this.userStrokes = [];
    this.currentStroke = null;
    this.redraw();
  }

  setTarget(target) {
    this.target = target || [];
    this.reset();
  }

  drawGrid() {
    const ctx = this.ctx;
    const w = this.width, h = this.height;
    ctx.clearRect(0, 0, w, h);
    // background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    // outer
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
    // center lines
    ctx.beginPath();
    ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
    ctx.stroke();
  }

  drawTargetGuide() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = this.guideColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    this.target.forEach(stroke => {
      ctx.beginPath();
      stroke.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    });
    ctx.restore();
  }

  drawUser() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    this.userStrokes.forEach(stroke => {
      ctx.beginPath();
      stroke.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    });

    if (this.currentStroke && this.currentStroke.length) {
      ctx.beginPath();
      this.currentStroke.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
    ctx.restore();
  }

  redraw() {
    this.drawGrid();
    this.drawTargetGuide();
    this.drawUser();
  }

  // Penilaian yang lebih akurat: cocokkan urutan stroke dan kedekatan ke segmen garis
  score() {
    if (!this.target.length || !this.userStrokes.length) {
      this.emitScore(0);
      return;
    }

    // 1) Penalti jumlah stroke yang tidak sesuai
    const targetCount = this.target.length;
    const userCount = this.userStrokes.length;
    const strokeCountPenalty = Math.min(userCount, targetCount) / Math.max(targetCount, userCount);

    // 2) Skor kedekatan per stroke berdasarkan jarak ke segmen terdekat
    let accum = 0;
    let strokesEvaluated = 0;

    const clamp01 = (v) => Math.max(0, Math.min(1, v));

    // bantu: jarak titik ke segmen (p0-p1)
    function pointToSegmentDist(px, py, x1, y1, x2, y2) {
      const A = px - x1;
      const B = py - y1;
      const C = x2 - x1;
      const D = y2 - y1;

      const dot = A * C + B * D;
      const len_sq = C * C + D * D || 1;
      let t = dot / len_sq;
      t = Math.max(0, Math.min(1, t));

      const xx = x1 + t * C;
      const yy = y1 + t * D;
      const dx = px - xx;
      const dy = py - yy;
      return Math.hypot(dx, dy);
    }

    // buat daftar segmen untuk setiap stroke target
    const targetSegments = this.target.map(stroke => {
      const segs = [];
      for (let i = 1; i < stroke.length; i++) {
        segs.push([stroke[i-1], stroke[i]]);
      }
      // jika hanya titik tunggal, duplikasi supaya tidak kosong
      if (segs.length === 0 && stroke.length === 1) {
        segs.push([stroke[0], stroke[0]]);
      }
      return segs;
    });

    // evaluasi maksimal untuk pasangan stroke yang cocok berdasarkan indeks (sederhana)
    const pairs = Math.min(userCount, targetCount);
    for (let i = 0; i < pairs; i++) {
      const uStroke = this.userStrokes[i];
      const segs = targetSegments[i];
      if (!uStroke || !segs || !segs.length) continue;

      // sample setiap N titik untuk efisiensi
      const step = Math.max(1, Math.floor(uStroke.length / 200));
      let matchPts = 0;
      let considered = 0;

      for (let k = 0; k < uStroke.length; k += step) {
        considered++;
        const p = uStroke[k];
        // cari segmen terdekat
        let best = Infinity;
        for (const [a, b] of segs) {
          const d = pointToSegmentDist(p.x, p.y, a.x, a.y, b.x, b.y);
          if (d < best) best = d;
        }
        // normalisasi jarak: 0 pada 0px, turun sampai 0 pada > 24px
        const tol = 24; // toleransi efektif
        const contrib = clamp01(1 - best / tol);
        matchPts += contrib;
      }

      const strokeScore = considered ? (matchPts / considered) : 0;
      accum += strokeScore;
      strokesEvaluated++;
    }

    const proximityScore = strokesEvaluated ? (accum / strokesEvaluated) : 0;

    // 3) gabungkan: bobot urutan stroke 30%, kedekatan 70%
    const finalScore = 0.3 * strokeCountPenalty + 0.7 * proximityScore;
    this.emitScore(finalScore);
  }

  isNearAnyTargetPoint(p, buffer) {
    // fallback util lama (dipakai jika dibutuhkan)
    for (const stroke of this.target) {
      for (const q of stroke) {
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d <= buffer) return true;
      }
    }
    return false;
  }

  emitScore(score) {
    this.onScore?.(score);
  }
}

// Target contoh sederhana (placeholder) untuk kana "あ"
export function targetForA(width = 320, height = 320) {
  // Sketch kasar 3 stroke "あ" (bukan akurat, hanya placeholder visual awal)
  const w = width, h = height;
  const s1 = [ {x: w*0.25, y:h*0.2}, {x:w*0.45, y:h*0.2}, {x:w*0.55, y:h*0.25} ];
  const s2 = [ {x:w*0.35, y:h*0.35}, {x:w*0.6, y:h*0.35}, {x:w*0.7, y:h*0.5}, {x:w*0.6, y:h*0.65}, {x:w*0.35, y:h*0.65}, {x:w*0.25, y:h*0.5}, {x:w*0.35, y:h*0.35} ];
  const s3 = [ {x:w*0.55, y:h*0.2}, {x:w*0.55, y:h*0.75} ];
  return [s1, s2, s3];
}

/**
 * Target stroke untuk Katakana "ア" (lebih representatif)
 * Urutan stroke (2):
 * 1) Garis miring dari kanan-atas ke kiri-bawah
 * 2) Garis vertikal bagian kiri
 */
export function targetForA_Kata(width = 320, height = 320) {
  const w = width, h = height;
  // Stroke 1: diagonal miring (kanan-atas ke kiri-bawah)
  const s1 = [
    { x: w*0.75, y: h*0.20 },
    { x: w*0.55, y: h*0.35 },
    { x: w*0.38, y: h*0.55 },
    { x: w*0.28, y: h*0.70 }
  ];
  // Stroke 2: vertikal kiri
  const s2 = [
    { x: w*0.32, y: h*0.18 },
    { x: w*0.32, y: h*0.78 }
  ];
  return [s1, s2];
}