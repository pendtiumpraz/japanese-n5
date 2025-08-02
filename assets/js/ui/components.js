/**
 * Komponen UI reusable (tanpa framework)
 * - Flashcard: tampilkan item (kana/kanji/vocab) + aksi audio
 * - Simple helpers untuk attach behavior setelah render
 */
import { speakText, pickJaVoice, stopSpeaking } from '../audio.js';
import { Store } from '../store.js';

export const Components = {
  Flashcard(item, opts = {}) {
    const settings = Store.getSettings();
    const showRomaji = opts.romaji ?? settings.romaji;
    const showMeaning = opts.meaning ?? true;

    const jp = item.kanji || item.kana || item.jp || item.wordKana || '';
    const romaji = item.romaji || '';
    const meaning = item.arti || item.meaning || '';

    const id = `fc_${Math.random().toString(36).slice(2,9)}`;
    return `
      <div class="flashcard" data-comp="flashcard" data-id="${id}" style="min-height: 200px; display: flex; flex-direction: column; justify-content: space-between; padding: 1.5rem;">
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
          <div class="jp" style="font-size: 2.5rem; line-height: 1.2; margin-bottom: 0.75rem;">${jp}</div>
          ${showRomaji && romaji ? `<div class="romaji" style="font-size: 1.125rem; margin-bottom: 0.5rem;">${romaji}</div>` : ``}
          ${showMeaning && meaning ? `<div class="meaning" style="font-size: 0.9375rem; color: var(--muted);">${meaning}</div>` : ``}
        </div>
        <div class="actions" style="display: flex; gap: 0.5rem; justify-content: center; align-items: center; margin-top: 1rem;">
          <button class="btn small" data-action="play">🔊 Play</button>
          <button class="btn outline small" data-action="stop">⏹ Stop</button>
          <button class="icon-btn" data-action="bookmark" title="Bookmark" style="width: 36px; height: 36px;">🔖</button>
        </div>
      </div>
    `;
  },

  attachFlashcardBehavior(root = document) {
    const compSel = '[data-comp="flashcard"]';
    root.querySelectorAll(compSel).forEach(el => {
      if (el.__wired) return;
      el.__wired = true;

      const jpText = el.querySelector('.jp')?.textContent?.trim() || '';
      const playBtn = el.querySelector('[data-action="play"]');
      const stopBtn = el.querySelector('[data-action="stop"]');
      const bookmarkBtn = el.querySelector('[data-action="bookmark"]');

      playBtn?.addEventListener('click', async () => {
        const s = Store.getSettings();
        const voice = await pickJaVoice(s.ttsVoice);
        speakText(jpText, { voice, rate: s.ttsRate, pitch: s.ttsPitch, volume: s.ttsVolume });
      });
      stopBtn?.addEventListener('click', () => stopSpeaking());
      bookmarkBtn?.addEventListener('click', () => {
        const id = el.getAttribute('data-id') || jpText;
        Store.addBookmark(id);
        bookmarkBtn.textContent = '✅';
        setTimeout(()=> bookmarkBtn.textContent='🔖', 1000);
      });
    });
  }
};