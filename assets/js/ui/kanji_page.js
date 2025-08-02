/**
 * Kanji N5 Page
 * - Browse list of N5 kanji with basic info and examples
 * - Simple stroke practice panel using StrokeTrainer with simplified stroke guides
 * - Mini-quiz (choice) from kanji dataset
 */
import { KanjiN5Complete as KanjiN5 } from '../data/kanji_n5_complete.js';
import { StrokeTrainer, createHiDPICanvas } from '../write.js';
import { Quiz } from '../quiz.js';

function renderList(items) {
  return `
    <div class="grid cols-3" style="margin-top:.5rem;">
      ${items.map((k, i) => `
        <div class="flashcard" data-kanji-idx="${i}">
          <div class="jp" style="font-size:48px;">${k.kanji}</div>
          <div class="romaji">${(k.onyomi||[]).join('・')} ${k.kunyomi?.length? '｜'+k.kunyomi.join('・') : ''}</div>
          <div class="meaning">${k.meaning || ''}</div>
          <div class="actions" style="margin-top:.5rem;">
            <button class="btn small" data-action="practice" data-idx="${i}">Latihan Stroke</button>
            <button class="btn outline small" data-action="examples" data-idx="${i}">Contoh</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderPracticePanel() {
  return `
    <section class="card" id="kanjiPractice">
      <div class="row">
        <h3>Latihan Stroke</h3>
        <span class="space"></span>
        <button class="btn outline" id="btnResetKanjiStroke">Reset</button>
      </div>
      <div class="row" style="margin-top:.5rem; gap:1rem; align-items:flex-start;">
        <div id="kanjiCanvasWrap" style="width:320px; height:320px;"></div>
        <div class="card" style="flex:1;">
          <div class="muted">Pilih Kanji dari daftar untuk memuat panduan stroke.</div>
          <div id="kanjiMeta" style="margin-top:.5rem;"></div>
        </div>
      </div>
    </section>
  `;
}

function renderQuizPanel() {
  return `
    <section class="card" id="kanjiQuiz">
      <div class="row">
        <h3>Mini Kuis Kanji</h3>
        <span class="space"></span>
        <button class="btn" id="btnStartKanjiQuiz">Mulai</button>
      </div>
      <div id="kanjiQuizWrap" style="margin-top:.5rem;"></div>
    </section>
  `;
}

export const KanjiPage = {
  render() {
    const items = KanjiN5; // Show all 100 N5 kanji
    return `
      <section class="grid">
        <div class="card">
          <h3>Writing Kanji (N5)</h3>
          <p class="muted">${KanjiN5.length} Kanji JLPT N5 lengkap dengan contoh dan latihan stroke.</p>
        </div>
        ${renderList(items)}
        ${renderPracticePanel()}
        ${renderQuizPanel()}
      </section>
    `;
  },

  onMount() {
    let trainer = new StrokeTrainer({ width: 320, height: 320, target: [] });

    function loadKanji(idx) {
      const k = KanjiN5[idx];
      if (!k) return;
      const meta = document.getElementById('kanjiMeta');
      if (meta) {
        const onyomi = (k.onyomi||[]).join('・');
        const kunyomi = (k.kunyomi||[]).join('・');
        const ex = (k.examples||[]).map(e => `<div class="muted">• ${e.jp} — ${e.romaji} — ${e.meaning}</div>`).join('');
        meta.innerHTML = `
          <div class="row"><div class="jp" style="font-size:48px;">${k.kanji}</div></div>
          <div>Onyomi: ${onyomi || '-'}</div>
          <div>Kunyomi: ${kunyomi || '-'}</div>
          <div>Arti: ${k.meaning || '-'}</div>
          <div style="margin-top:.5rem;">Contoh:${ex ? ex : ' (tidak tersedia)'}</div>
        `;
      }
      const wrap = document.getElementById('kanjiCanvasWrap');
      if (!wrap) return;
      trainer = new StrokeTrainer({ width: 320, height: 320, target: (k.strokes?.(320,320) || []) });
      trainer.mount(wrap);
      document.getElementById('btnResetKanjiStroke')?.addEventListener('click', () => trainer.reset());
    }

    document.querySelectorAll('[data-action="practice"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx') || '0', 10);
        loadKanji(idx);
      });
    });

    document.querySelectorAll('[data-action="examples"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx') || '0', 10);
        const k = KanjiN5[idx];
        if (!k) return;
        const meta = document.getElementById('kanjiMeta');
        if (!meta) return;
        const ex = (k.examples||[]).map(e => `<div class="muted">• ${e.jp} — ${e.romaji} — ${e.meaning}</div>`).join('');
        meta.innerHTML = `
          <div class="row"><div class="jp" style="font-size:48px;">${k.kanji}</div></div>
          <div style="margin-top:.5rem;">Contoh:${ex ? ex : ' (tidak tersedia)'}</div>
        `;
      });
    });

    // Mini-quiz
    document.getElementById('btnStartKanjiQuiz')?.addEventListener('click', () => {
      const pool = KanjiN5.slice(0, 20).map(k => ({ kana: k.kanji, romaji: (k.meaning || '').toLowerCase() || k.kanji }));
      const wrap = document.getElementById('kanjiQuizWrap');
      if (!wrap) return;
      // Build 5 questions
      const qs = [];
      for (let i=0;i<5;i++) {
        const idx = Math.floor(Math.random()*pool.length);
        // mix types
        qs.push(i < 3 ? Quiz.makeChoiceQuestion(pool, idx) : Quiz.makeTypingQuestion(pool, idx));
      }
      let qi = 0;
      const next = () => {
        if (qi >= qs.length) {
          wrap.innerHTML = `<div class="row"><div>✅ Selesai!</div><span class="space"></span><button class="btn" id="btnAgainKQuiz">Ulangi</button></div>`;
          document.getElementById('btnAgainKQuiz')?.addEventListener('click', () => {
            document.getElementById('btnStartKanjiQuiz')?.click();
          });
          return;
        }
        const q = qs[qi];
        wrap.innerHTML = Quiz.renderQuestion(q, qi, qs.length);
        Quiz.attachHandlers(wrap, q, () => { qi++; next(); });
      };
      next();
    });
  }
};