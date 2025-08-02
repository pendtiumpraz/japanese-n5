/**
 * Dialog Listening + Shadowing
 * - Renders short N5 dialogs with per-line TTS play and highlight
 * - Play/Pause all, progress indicator
 * - Simple listening quiz based on dialog content
 */
import { Store } from '../store.js';
import { pickJaVoice, speakText, stopSpeaking } from '../audio.js';

const dialogs = [
  {
    id: 'greeting1',
    title: 'Sapaan di pagi hari',
    lines: [
      { jp: 'おはようございます。', romaji: 'ohayou gozaimasu', id: 'l1' },
      { jp: 'おはようございます。元気ですか。', romaji: 'ohayou gozaimasu. genki desu ka', id: 'l2' },
      { jp: '元気です。あなたは？', romaji: 'genki desu. anata wa?', id: 'l3' },
      { jp: '私も元気です。', romaji: 'watashi mo genki desu', id: 'l4' }
    ],
    quiz: [
      { q: 'Apa arti おはようございます?', a: 'selamat pagi', opts: ['selamat pagi','terima kasih','permisi'] },
      { q: 'Kata untuk "sehat/baik" dalam dialog?', a: 'genki', opts: ['genki','arigatou','sumimasen'] }
    ]
  },
  {
    id: 'selfintro1',
    title: 'Perkenalan singkat',
    lines: [
      { jp: 'はじめまして。', romaji: 'hajimemashite', id: 'l1' },
      { jp: '私は田中です。', romaji: 'watashi wa Tanaka desu', id: 'l2' },
      { jp: 'よろしくお願いします。', romaji: 'yoroshiku onegai shimasu', id: 'l3' }
    ],
    quiz: [
      { q: 'Apa arti はじめまして?', a: 'perkenalkan', opts: ['perkenalkan','selamat malam','sampai jumpa'] },
      { q: 'Frasa sopan penutup perkenalan?', a: 'yoroshiku onegai shimasu', opts: ['yoroshiku onegai shimasu','ohayou gozaimasu','arigatou'] }
    ]
  }
];

function renderDialogCard(d) {
  const settings = Store.getSettings();
  return `
    <section class="card" data-dialog="${d.id}">
      <div class="row">
        <h3>${d.title}</h3>
        <span class="space"></span>
        <button class="btn" data-action="play-all" data-id="${d.id}">▶️ Putar Semua</button>
        <button class="btn outline" data-action="stop-all" data-id="${d.id}">⏹️ Stop</button>
      </div>
      <div class="muted" style="margin-top:.25rem;">Klik ▶️ di setiap baris untuk shadowing per baris.</div>

      <div class="grid" style="margin-top:.75rem;">
        ${d.lines.map((ln, idx) => `
          <div class="flashcard" data-line="${ln.id}">
            <div class="row">
              <div class="jp" style="font-size:28px;">${ln.jp}</div>
              <span class="space"></span>
              <button class="btn" data-action="play-line" data-dialog="${d.id}" data-line="${ln.id}">▶️</button>
            </div>
            ${settings.romaji ? `<div class="romaji">${ln.romaji}</div>` : ``}
          </div>
        `).join('')}
      </div>

      <div class="row" style="margin-top:.5rem;">
        <div class="muted">Progres:</div>
        <div id="progress_${d.id}" class="muted">0 / ${d.lines.length}</div>
      </div>

      <div class="card" style="margin-top:1rem;">
        <div class="row">
          <h4>Listening Quiz</h4>
          <span class="space"></span>
          <button class="btn outline" data-action="start-quiz" data-id="${d.id}">Mulai</button>
        </div>
        <div id="quizWrap_${d.id}" style="margin-top:.5rem;"></div>
      </div>
    </section>
  `;
}

function buildQuizHTML(d) {
  // simple 2-question quiz mix: choice-only
  return d.quiz.map((q, i) => `
    <div class="card" data-q="${d.id}_${i}">
      <div class="muted">${q.q}</div>
      <div class="row" style="margin-top:.5rem; flex-wrap:wrap; gap:.5rem;">
        ${q.opts.map(opt => `
          <button class="btn outline" data-action="opt" data-val="${opt}">${opt}</button>
        `).join('')}
      </div>
      <div class="row" style="margin-top:.5rem;">
        <div class="muted" data-role="feedback"></div>
      </div>
    </div>
  `).join('');
}

export const DialogPage = {
  render() {
    return `
      <section class="grid">
        <div class="card">
          <h3>Dialog Listening & Shadowing</h3>
          <p class="muted">Putar per baris atau semua, tirukan pengucapannya. Kerjakan kuis listening setelahnya.</p>
        </div>
        ${dialogs.map(renderDialogCard).join('')}
      </section>
    `;
  },

  onMount() {
    const state = { playingAll: null, idx: 0, cancel: false };

    // Play line
    document.querySelectorAll('[data-action="play-line"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const dId = btn.getAttribute('data-dialog') || '';
        const lId = btn.getAttribute('data-line') || '';
        const dialog = dialogs.find(x => x.id === dId);
        if (!dialog) return;
        const line = dialog.lines.find(x => x.id === lId);
        if (!line) return;

        highlightLine(dId, lId, true);
        const s = Store.getSettings();
        const v = await pickJaVoice(s.ttsVoice);
        await speakText(line.jp, { voice: v, rate: s.ttsRate, pitch: s.ttsPitch, volume: s.ttsVolume });
        highlightLine(dId, lId, false);
        incrementProgress(dId, dialog.lines.length);
      });
    });

    // Play all
    document.querySelectorAll('[data-action="play-all"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const dId = btn.getAttribute('data-id') || '';
        const dialog = dialogs.find(x => x.id === dId);
        if (!dialog) return;
        state.cancel = false;
        state.playingAll = dId;
        state.idx = 0;

        const s = Store.getSettings();
        const v = await pickJaVoice(s.ttsVoice);

        while (!state.cancel && state.playingAll === dId && state.idx < dialog.lines.length) {
          const ln = dialog.lines[state.idx];
          highlightLine(dId, ln.id, true);
          // play
          await speakText(ln.jp, { voice: v, rate: s.ttsRate, pitch: s.ttsPitch, volume: s.ttsVolume });
          highlightLine(dId, ln.id, false);
          incrementProgress(dId, dialog.lines.length);
          state.idx++;
          // small gap
          await new Promise(r => setTimeout(r, 180));
        }
        state.playingAll = null;
      });
    });

    // Stop all
    document.querySelectorAll('[data-action="stop-all"]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.cancel = true;
        stopSpeaking();
        state.playingAll = null;
        unhighlightAll();
      });
    });

    // Start quiz
    document.querySelectorAll('[data-action="start-quiz"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const dId = btn.getAttribute('data-id') || '';
        const d = dialogs.find(x => x.id === dId);
        if (!d) return;
        const wrap = document.getElementById(`quizWrap_${dId}`);
        if (!wrap) return;
        wrap.innerHTML = buildQuizHTML(d);

        wrap.querySelectorAll('[data-action="opt"]').forEach(optBtn => {
          optBtn.addEventListener('click', () => {
            const val = optBtn.getAttribute('data-val') || '';
            const card = optBtn.closest('[data-q]');
            const key = card?.getAttribute('data-q') || '';
            const idx = parseInt(key.split('_').pop() || '0', 10);
            const q = d.quiz[idx];
            const fb = card?.querySelector('[data-role="feedback"]');
            if (!q || !fb) return;
            const correct = val.trim().toLowerCase() === q.a.trim().toLowerCase();
            fb.textContent = correct ? 'Benar ✓' : `Salah ✗  Jawaban: ${q.a}`;
          });
        });
      });
    });

    function highlightLine(dialogId, lineId, on) {
      const sel = `[data-dialog="${dialogId}"] [data-line="${lineId}"]`;
      const el = document.querySelector(sel);
      if (!el) return;
      el.style.outline = on ? '2px solid var(--primary)' : 'none';
      el.style.background = on ? 'var(--surface)' : '';
    }

    function unhighlightAll() {
      document.querySelectorAll('[data-line]').forEach(el => {
        el.style.outline = 'none';
        el.style.background = '';
      });
    }

    function incrementProgress(dId, total) {
      const id = `progress_${dId}`;
      const el = document.getElementById(id);
      if (!el) return;
      const cur = parseInt(el.textContent?.split('/')[0].trim() || '0', 10);
      const next = Math.min(cur + 1, total);
      el.textContent = `${next} / ${total}`;
    }
  }
};