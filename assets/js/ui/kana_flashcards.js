/**
 * Halaman Writing Kana (M1)
 * - Menampilkan flashcards kana acak (Hiragana + Katakana)
 * - TTS untuk tiap kartu
 * - Kuis cepat (choice/typing) 5 soal
 */
import { Components } from './components.js';
import { Hiragana, Katakana, pickRandomKana } from '../data/kana.js';
import { Quiz } from '../quiz.js';
import { Store } from '../store.js';
import { pickJaVoice, speakText } from '../audio.js';

export const KanaFlashcardsPage = {
  render() {
    // Ambil 12 kartu acak (gabungan)
    const items = pickRandomKana(12);
    const settings = Store.getSettings();

    return `
      <section class="grid">
        <div class="card">
          <h3>Writing Kana</h3>
          <p class="muted">Hiragana + Katakana dasar. Putar audio dan pelajari romaji.</p>
          <div class="row" style="margin-top:.5rem;">
            <button class="btn" id="btnRefresh">Acak Ulang</button>
            <span class="space"></span>
            <label class="row">
              <input type="checkbox" id="toggleRomaji" ${settings.romaji ? 'checked':''}/>
              <span> Tampilkan Romaji</span>
            </label>
          </div>
        </div>

        <div class="grid cols-3" id="cardsWrap">
          ${items.map(it => Components.Flashcard(it)).join('')}
        </div>

        <div class="card">
          <h3>Kuis Cepat</h3>
          <p class="muted">5 soal acak untuk menguji pemahaman cepat.</p>
          <div id="quizWrap" style="margin-top:.5rem;"></div>
        </div>
      </section>
    `;
  },

  onMount() {
    // Wire flashcards
    const wrap = document.getElementById('cardsWrap');
    Components.attachFlashcardBehavior(wrap || document);

    // Toggle romaji -> simpan settings & re-render halaman
    const chk = document.getElementById('toggleRomaji');
    chk?.addEventListener('change', () => {
      Store.setSettings({ romaji: !!chk.checked });
      // Rerender route saat ini
      window.__appNavigate?.('/writing/kana');
    });

    // Refresh
    document.getElementById('btnRefresh')?.addEventListener('click', () => {
      window.__appNavigate?.('/writing/kana', { r: Math.random().toString(36).slice(2,6) });
    });

    // Setup kuis cepat 5 soal (3 choice, 2 typing)
    const pool = [...Hiragana, ...Katakana];
    const questions = [];
    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      const makeChoice = i < 3;
      questions.push(makeChoice ? Quiz.makeChoiceQuestion(pool, idx) : Quiz.makeTypingQuestion(pool, idx));
    }

    const quizWrap = document.getElementById('quizWrap');
    let qIdx = 0;
    const renderNext = () => {
      if (!quizWrap) return;
      if (qIdx >= questions.length) {
        quizWrap.innerHTML = `
          <div class="row">
            <div>✅ Selesai! Lanjut latihan lagi?</div>
            <span class="space"></span>
            <button class="btn" id="btnAgain">Ulangi 5 Soal</button>
          </div>
        `;
        document.getElementById('btnAgain')?.addEventListener('click', () => {
          window.__appNavigate?.('/writing/kana', { q: Math.random().toString(36).slice(2,6) });
        });
        return;
      }
      const q = questions[qIdx];
      quizWrap.innerHTML = Quiz.renderQuestion(q, qIdx, questions.length);
      Quiz.attachHandlers(quizWrap, q, () => {
        qIdx++;
        renderNext();
      });
    };
    renderNext();
  }
};