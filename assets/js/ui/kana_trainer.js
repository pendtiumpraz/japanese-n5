/**
 * Integrasi Stroke Trainer untuk Hiragana "あ" pada halaman /writing/kana
 * - Menyediakan panel latihan stroke dengan skor real-time dan tombol reset
 * - Menggunakan StrokeTrainer & targetForA dari assets/js/write.js
 */
import { StrokeTrainer, targetForA } from '../write.js';
import { Store } from '../store.js';

export const KanaTrainer = {
  render() {
    return `
      <section class="card" id="trainerCard">
        <div class="row">
          <h3>Latihan Stroke: あ (a)</h3>
          <span class="space"></span>
          <button class="btn outline" id="btnResetTrace">Reset</button>
        </div>
        <p class="muted" style="margin-top:.25rem;">Jejak garis mengikuti contoh stroke. Skor berdasarkan kedekatan garis dengan contoh.</p>
        <div class="row" style="margin-top:.5rem; gap:1rem; align-items:flex-start;">
          <div id="trainerCanvasWrap" style="width:320px; height:320px;"></div>
          <div class="card" style="flex:1; min-height:80px;">
            <div class="row">
              <div class="muted">Skor</div>
              <span class="space"></span>
              <div id="trainerScore" style="font-weight:700;">0%</div>
            </div>
            <div style="margin-top:.5rem;">
              <div class="muted">Tips</div>
              <ul style="margin-top:.25rem; padding-left:1rem;">
                <li>Gambar mengikuti urutan stroke contoh.</li>
                <li>Gunakan jari (mobile) atau mouse (desktop).</li>
                <li>Tekan Reset untuk mencoba lagi.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  onMount() {
    const wrap = document.getElementById('trainerCanvasWrap');
    if (!wrap) return;
    const trainer = new StrokeTrainer({
      width: 320,
      height: 320,
      target: targetForA(320, 320)
    });
    trainer.onScore = (s) => {
      const el = document.getElementById('trainerScore');
      if (el) el.textContent = Math.round(s * 100) + '%';
    };
    trainer.mount(wrap);

    document.getElementById('btnResetTrace')?.addEventListener('click', () => {
      trainer.reset();
      const el = document.getElementById('trainerScore');
      if (el) el.textContent = '0%';
    });
  }
};