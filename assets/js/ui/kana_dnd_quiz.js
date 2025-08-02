/**
 * Kuis Drag-and-Drop: Pasangkan romaji ke kotak hiragana yang benar (grid dasar a–n)
 * - Kananya ditampilkan sebagai grid gojūon hiragana
 * - Romaji cards diacak; pengguna drag kartu ke sel yang benar
 * - Feedback benar/salah, skor, tombol reset
 */
import { Hiragana } from '../data/kana.js';

function buildHiraganaGrid() {
  // Susun gojūon hiragana dasar (tanpa diakritik/youon)
  const rows = [
    ['a','i','u','e','o'],
    ['ka','ki','ku','ke','ko'],
    ['sa','shi','su','se','so'],
    ['ta','chi','tsu','te','to'],
    ['na','ni','nu','ne','no'],
    ['ha','hi','fu','he','ho'],
    ['ma','mi','mu','me','mo'],
    ['ya',null,'yu',null,'yo'],
    ['ra','ri','ru','re','ro'],
    ['wa',null,null,null,'wo'],
    ['n',null,null,null,null],
  ];
  // Mapping romaji->kana dari dataset Hiragana
  const map = {};
  Hiragana.forEach(it => { map[it.romaji] = it.kana; });
  return { rows, map };
}

function pickRomajiPool(count = 12) {
  // Ambil subset hiragana dasar sesuai yang ada di grid
  const { rows } = buildHiraganaGrid();
  const romajiAll = rows.flat().filter(Boolean);
  const pool = romajiAll.slice();
  const result = [];
  while (result.length < Math.min(count, pool.length)) {
    const i = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(i, 1)[0]);
  }
  return result;
}

export const KanaDnDQuiz = {
  render() {
    const { rows, map } = buildHiraganaGrid();
    const romajiList = pickRomajiPool(12); // 12 kartu untuk sesi
    const cardsHtml = romajiList.map(r => `
      <button class="btn outline" draggable="true" data-drag="romaji" data-val="${r}" aria-grabbed="false">${r}</button>
    `).join('');

    // Grid sel target
    const gridHtml = rows.map((row, rIdx) => `
      <div class="row" style="gap:.35rem;">
        ${row.map((r, cIdx) => r ? `
          <div class="card" data-drop="cell" data-romaji="${r}" style="width:64px; height:64px; display:grid; place-items:center;">
            <div class="jp" style="font-size:28px;">${map[r]}</div>
            <div class="muted" data-slot style="font-size:12px; margin-top:.2rem;"></div>
          </div>
        ` : `<div style="width:64px; height:64px;"></div>`).join('')}
      </div>
    `).join('');

    return `
      <section class="card" id="dndCard">
        <div class="row">
          <h3>Kuis DnD: Romaji → Hiragana</h3>
          <span class="space"></span>
          <button class="btn outline" id="btnResetDnd">Reset</button>
        </div>
        <p class="muted" style="margin-top:.25rem;">Seret kartu romaji ke sel hiragana yang sesuai.</p>

        <div style="margin-top:.5rem;">
          <div class="muted" style="margin-bottom:.35rem;">Kartu Romaji</div>
          <div id="dndCards" class="row" style="flex-wrap:wrap; gap:.5rem;">
            ${cardsHtml}
          </div>
        </div>

        <div style="margin-top:1rem;">
          <div class="muted" style="margin-bottom:.35rem;">Grid Hiragana</div>
          <div id="dndGrid" class="grid" style="gap:.35rem;">
            ${gridHtml}
          </div>
        </div>

        <div class="row" style="margin-top:.75rem;">
          <div class="muted">Skor: <span id="dndScore">0</span> / <span id="dndTotal">${romajiList.length}</span></div>
          <span class="space"></span>
          <div id="dndFeedback" class="muted"></div>
        </div>
      </section>
    `;
  },

  onMount() {
    const cardWrap = document.getElementById('dndCards');
    const grid = document.getElementById('dndGrid');
    if (!cardWrap || !grid) return;

    // Ensure cards are clickable
    cardWrap.querySelectorAll('[data-drag="romaji"]').forEach(btn => {
      btn.style.pointerEvents = 'auto';
      btn.style.touchAction = 'manipulation';
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');
    });

    let score = 0;
    const scoreEl = document.getElementById('dndScore');
    const feedbackEl = document.getElementById('dndFeedback');
    const total = parseInt(document.getElementById('dndTotal')?.textContent || '0', 10);
    let picked = null;

    function updateScore(delta) {
      score += delta;
      if (scoreEl) scoreEl.textContent = String(score);
      if (feedbackEl) {
        if (score >= total) feedbackEl.textContent = '✅ Selesai!';
        else feedbackEl.textContent = '';
      }
    }

    // Drag start
    cardWrap.querySelectorAll('[data-drag="romaji"]').forEach(btn => {
      btn.addEventListener('dragstart', (e) => {
        const val = btn.getAttribute('data-val') || '';
        e.dataTransfer?.setData('text/plain', val);
        btn.setAttribute('aria-grabbed', 'true');
        setTimeout(() => btn.classList.add('dragging'), 0);
        picked = btn;
      });
      btn.addEventListener('dragend', () => {
        btn.classList.remove('dragging');
        btn.setAttribute('aria-grabbed', 'false');
      });
      // Click to select card
      btn.addEventListener('click', () => {
        if (btn.getAttribute('draggable') === 'false') return;
        if (picked === btn) {
          btn.classList.remove('dragging');
          btn.removeAttribute('data-picked');
          btn.setAttribute('aria-grabbed', 'false');
          picked = null;
          if (feedbackEl) feedbackEl.textContent = '';
          return;
        }
        const prev = cardWrap.querySelector('[data-drag="romaji"][data-picked="true"]');
        prev?.classList.remove('dragging');
        prev?.removeAttribute('data-picked');
        prev?.setAttribute('aria-grabbed', 'false');

        picked = btn;
        btn.classList.add('dragging');
        btn.setAttribute('data-picked', 'true');
        btn.setAttribute('aria-grabbed', 'true');
        if (feedbackEl) feedbackEl.textContent = `Pilih sel untuk "${(btn.getAttribute('data-val')||'').toUpperCase()}"`;
      });
      // Keyboard selection
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

    // Allow drop via native DnD
    grid.querySelectorAll('[data-drop="cell"]').forEach(cell => {
      cell.setAttribute('tabindex', '0');
      cell.addEventListener('dragover', (e) => {
        e.preventDefault();
        cell.style.outline = '2px dashed var(--primary)';
      });
      cell.addEventListener('dragleave', () => {
        cell.style.outline = 'none';
      });
      cell.addEventListener('drop', (e) => {
        e.preventDefault();
        cell.style.outline = 'none';
        const expected = (cell.getAttribute('data-romaji') || '').toLowerCase();
        const dragged = (e.dataTransfer?.getData('text/plain') || '').toLowerCase();
        const slot = cell.querySelector('[data-slot]');
        if (!expected || !dragged || !slot) return;
        if (slot.textContent?.trim()) return;

        if (dragged === expected) {
          slot.textContent = dragged.toUpperCase();
          slot.style.color = 'var(--primary)';
          const card = cardWrap.querySelector(`[data-drag="romaji"][data-val="${dragged}"]`);
          if (card) {
            card.setAttribute('draggable', 'false');
            card.classList.add('card');
            card.classList.remove('btn','outline','dragging');
            card.style.opacity = '0.6';
            card.removeAttribute('data-picked');
            card.setAttribute('aria-grabbed', 'false');
          }
          picked = null;
          updateScore(1);
        } else {
          cell.animate?.([{ background: '#fee2e2' }, { background: 'transparent' }], { duration: 350 });
          if (feedbackEl) feedbackEl.textContent = `Salah untuk "${dragged.toUpperCase()}". Coba lagi.`;
          setTimeout(()=> { if (feedbackEl) feedbackEl.textContent=''; }, 900);
        }
      });

      // Click to place selected card (mouse without DnD)
      cell.addEventListener('click', () => {
        if (!picked) return;
        const expected = (cell.getAttribute('data-romaji') || '').toLowerCase();
        const dragged = (picked.getAttribute('data-val') || '').toLowerCase();
        const slot = cell.querySelector('[data-slot]');
        if (!slot || slot.textContent?.trim()) return;

        if (dragged === expected) {
          slot.textContent = dragged.toUpperCase();
          slot.style.color = 'var(--primary)';
          picked.setAttribute('draggable', 'false');
          picked.classList.add('card');
          picked.classList.remove('btn','outline','dragging');
          picked.style.opacity = '0.6';
          picked.removeAttribute('data-picked');
          picked.setAttribute('aria-grabbed', 'false');
          picked = null;
          updateScore(1);
          if (feedbackEl) feedbackEl.textContent = '';
        } else {
          cell.animate?.([{ background: '#fee2e2' }, { background: 'transparent' }], { duration: 350 });
          if (feedbackEl) feedbackEl.textContent = `Salah untuk "${dragged.toUpperCase()}". Coba lagi.`;
          setTimeout(()=> { if (feedbackEl) feedbackEl.textContent=''; }, 900);
        }
      });

      // Keyboard place
      cell.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && picked) {
          e.preventDefault();
          cell.click();
        }
      });
    });

    // Reset
    document.getElementById('btnResetDnd')?.addEventListener('click', () => {
      window.__appNavigate?.('/writing/kana/hiragana', { dnd: Math.random().toString(36).slice(2,6) });
    });
  }
};