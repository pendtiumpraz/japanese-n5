/**
 * Grammar N5 - Initial module with 3 topics:
 * - Particles: は vs が vs を
 * - Copula です
 * - Polite verb -ます
 * Provides examples + mini quizzes per topic (choice + typing).
 */
import { Quiz } from '../quiz.js';
import { Store } from '../store.js';
import { pickJaVoice, speakText } from '../audio.js';

const topics = [
  {
    id: 'particles',
    title: 'Partikel: は vs が vs を',
    explain: `
      は (wa) menandai topik kalimat, が (ga) menandai subjek baru/penekanan,
      を (wo) menandai objek langsung.
    `,
    examples: [
      { jp: '私は学生です。', romaji: 'watashi wa gakusei desu', meaning: 'Saya adalah pelajar.' },
      { jp: '猫が好きです。', romaji: 'neko ga suki desu', meaning: 'Saya suka kucing.' },
      { jp: '水を飲みます。', romaji: 'mizu o nomimasu', meaning: 'Saya minum air.' }
    ],
    quizPool: [
      { kana: '私は学生です', romaji: 'wa', opts: ['wa','ga','o'] },
      { kana: '猫__好きです', romaji: 'ga', opts: ['wa','ga','o'] },
      { kana: '水__飲みます', romaji: 'o', opts: ['wa','ga','o'] },
    ]
  },
  {
    id: 'desu',
    title: 'Kopula です',
    explain: `
      です menyatakan "adalah" secara sopan. Bentuk negatif: ではありません / じゃありません. 
      Bentuk lampau: でした.
    `,
    examples: [
      { jp: 'これは本です。', romaji: 'kore wa hon desu', meaning: 'Ini adalah buku.' },
      { jp: '彼は先生ではありません。', romaji: 'kare wa sensei dewa arimasen', meaning: 'Dia bukan guru.' },
      { jp: '昨日は休みでした。', romaji: 'kinou wa yasumi deshita', meaning: 'Kemarin adalah libur.' }
    ],
    quizPool: [
      { kana: 'これは本__。', romaji: 'desu', opts: ['desu','dewa arimasen','deshita'] },
      { kana: '彼は先生__。', romaji: 'dewa arimasen', opts: ['desu','dewa arimasen','deshita'] },
      { kana: '昨日は休み__。', romaji: 'deshita', opts: ['desu','dewa arimasen','deshita'] },
    ]
  },
  {
    id: 'masu',
    title: 'Bentuk sopan -ます',
    explain: `
      -ます adalah akhiran sopan untuk kata kerja (present/future). Negatif: -ません. Lampau: -ました.
      Lampau negatif: -ませんでした.
    `,
    examples: [
      { jp: '毎日日本語を勉強します。', romaji: 'mainichi nihongo o benkyou shimasu', meaning: 'Belajar bahasa Jepang setiap hari.' },
      { jp: '今日は行きません。', romaji: 'kyou wa ikimasen', meaning: 'Hari ini tidak pergi.' },
      { jp: '昨日は食べました。', romaji: 'kinou wa tabemashita', meaning: 'Kemarin sudah makan.' }
    ],
    quizPool: [
      { kana: '今朝コーヒーを飲み__。', romaji: 'mashita', opts: ['masu','masen','mashita'] },
      { kana: '今日は勉強し__。', romaji: 'masen', opts: ['masu','masen','mashita'] },
      { kana: '毎日走り__。', romaji: 'masu', opts: ['masu','masen','mashita'] },
    ]
  }
];

function renderExamples(examples) {
  return `
    <div class="grid cols-3" style="margin-top:.5rem;">
      ${examples.map(ex => `
        <div class="flashcard">
          <div class="jp">${ex.jp}</div>
          <div class="romaji">${ex.romaji}</div>
          <div class="meaning">${ex.meaning}</div>
          <div class="actions">
            <button class="btn" data-action="play" data-text="${ex.jp}">▶️ Putar</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function makeMiniQuiz(pool) {
  // convert simple pool into Quiz questions: 2 choice + 1 typing
  const items = pool.slice();
  const qs = [];
  // choice
  for (let i = 0; i < 2 && i < items.length; i++) {
    const it = items[i];
    const options = it.opts.map(o => ({ romaji: o, kana: o }));
    const correctIdx = it.opts.findIndex(o => o === it.romaji);
    // build question format required by Quiz
    const q = {
      type: 'choice',
      prompt: it.kana.replace('__', '＿'),
      options,
      answer: it.romaji,
      meta: { correct: { kana: it.kana, romaji: it.romaji } }
    };
    qs.push(q);
  }
  // typing
  if (items[2]) {
    const it = items[2];
    qs.push({
      type: 'typing',
      prompt: it.kana.replace('__', '＿'),
      answer: it.romaji,
      meta: { correct: { kana: it.kana, romaji: it.romaji } }
    });
  }
  return qs;
}

function renderTopic(topic) {
  const qsKey = `__gq_${topic.id}`;
  const qs = makeMiniQuiz(topic.quizPool);
  window[qsKey] = qs;

  return `
    <section class="card">
      <h3>${topic.title}</h3>
      <p class="muted">${topic.explain}</p>
      ${renderExamples(topic.examples)}
      <div class="row" style="margin-top:1rem;">
        <button class="btn" data-action="start-quiz" data-topic="${topic.id}">Mulai Mini Kuis</button>
      </div>
      <div id="quizWrap_${topic.id}" style="margin-top:.75rem;"></div>
    </section>
  `;
}

export const GrammarPage = {
  render() {
    return `
      <section class="grid">
        <div class="card">
          <h3>Grammar N5 - Dasar</h3>
          <p class="muted">Pelajari pola kalimat dasar dengan contoh dan mini-kuis.</p>
        </div>

        ${topics.map(renderTopic).join('')}
      </section>
    `;
  },

  onMount() {
    // Example TTS play
    document.querySelectorAll('[data-action="play"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-text') || '';
        const s = Store.getSettings();
        const voice = await pickJaVoice(s.ttsVoice);
        speakText(text, { voice, rate: s.ttsRate, pitch: s.ttsPitch, volume: s.ttsVolume });
      });
    });

    // Mini-quiz runners
    topics.forEach(topic => {
      const startBtn = document.querySelector(`[data-action="start-quiz"][data-topic="${topic.id}"]`);
      const wrap = document.getElementById(`quizWrap_${topic.id}`);
      if (!startBtn || !wrap) return;

      startBtn.addEventListener('click', () => {
        const qs = window[`__gq_${topic.id}`] || [];
        let idx = 0;

        const renderNext = () => {
          if (idx >= qs.length) {
            wrap.innerHTML = `<div class="row"><div>✅ Selesai!</div><span class="space"></span><button class="btn" data-restart="${topic.id}">Ulangi</button></div>`;
            wrap.querySelector(`[data-restart="${topic.id}"]`)?.addEventListener('click', () => {
              idx = 0; renderNext();
            });
            return;
          }
          const q = qs[idx];
          wrap.innerHTML = Quiz.renderQuestion(q, idx, qs.length);
          Quiz.attachHandlers(wrap, q, () => { idx++; renderNext(); });
        };

        renderNext();
      });
    });
  }
};