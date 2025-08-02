/**
 * Filter Hiragana/Katakana untuk halaman Writing Kana
 * - Render switch filter
 * - Simpan preferensi ke Store.settings.kanaFilter: 'all'|'hiragana'|'katakana'
 * - Trigger re-render halaman /writing/kana saat berubah
 */
import { Store } from '../store.js';

export const KanaFilter = {
  render() {
    const val = Store.getSettings().kanaFilter || 'all';
    return `
      <section class="card" id="kanaFilterCard">
        <div class="row">
          <h3>Filter Kana</h3>
          <span class="space"></span>
          <label class="row" style="gap:.5rem;">
            <select id="kanaFilterSelect" aria-label="Pilih filter kana">
              <option value="all" ${val==='all'?'selected':''}>Hiragana + Katakana</option>
              <option value="hiragana" ${val==='hiragana'?'selected':''}>Hiragana saja</option>
              <option value="katakana" ${val==='katakana'?'selected':''}>Katakana saja</option>
            </select>
          </label>
        </div>
        <p class="muted" style="margin-top:.25rem;">Filter ini mempengaruhi flashcards dan kuis pada halaman Writing Kana.</p>
      </section>
    `;
  },

  onMount() {
    const sel = document.getElementById('kanaFilterSelect');
    if (!sel) return;
    sel.addEventListener('change', () => {
      const v = sel.value;
      Store.setSettings({ kanaFilter: v });
      // Rerender route saat ini agar filter diterapkan
      window.__appNavigate?.('/writing/kana', { f: Math.random().toString(36).slice(2,6) });
    });
  }
};