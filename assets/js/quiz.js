/**
 * Engine kuis sederhana untuk M1
 * - Tipe: choice (multiple choice), typing
 * - Generate soal dari data kana
 * - Render HTML + attach behavior
 */
import { pickJaVoice, speakText, stopSpeaking } from './audio.js';
import { Store } from './store.js';

export const Quiz = {
  makeChoiceQuestion(pool, correctIdx) {
    const correct = pool[correctIdx];
    // opsi: 1 benar + 3 salah unik
    const options = [correct];
    const used = new Set([correctIdx]);
    while (options.length < 4 && used.size < pool.length) {
      const i = Math.floor(Math.random() * pool.length);
      if (used.has(i)) continue;
      used.add(i);
      options.push(pool[i]);
    }
    // shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return { type: 'choice', prompt: correct.kana, options, answer: correct.romaji, meta: { correct } };
  },

  makeTypingQuestion(pool, correctIdx) {
    const correct = pool[correctIdx];
    return { type: 'typing', prompt: correct.kana, answer: correct.romaji, meta: { correct } };
  },

  renderQuestion(q, idx, total) {
    const s = Store.getSettings();
    const id = `q_${Math.random().toString(36).slice(2,8)}`;
    let html = `
      <div class="card" data-quiz="${id}">
        <div class="row">
          <div class="muted">Soal ${idx + 1} / ${total}</div>
          <span class="space"></span>
          <button class="icon-btn" data-action="tts" title="Putar soal">▶️</button>
        </div>
        <div class="flashcard" style="margin-top:.75rem;">
          <div class="jp">${q.prompt}</div>
          ${s.romaji ? `<div class="romaji">Romaji?</div>` : ``}
        </div>
    `;
    if (q.type === 'choice') {
      html += `
        <div class="grid cols-2" style="margin-top:.75rem;">
          ${q.options.map(o => `
            <button class="btn outline" data-action="opt" data-val="${o.romaji}">${o.romaji}</button>
          `).join('')}
        </div>
      `;
    } else {
      html += `
        <div class="row" style="margin-top:.75rem;">
          <input type="text" class="card" style="padding:.5rem;" placeholder="Ketik romaji (mis. 'ka')" data-role="answer"/>
          <button class="btn" data-action="check">Cek</button>
        </div>
      `;
    }
    html += `
        <div class="row" style="margin-top:.75rem;">
          <div class="muted" data-role="feedback"></div>
          <span class="space"></span>
          <button class="btn" data-action="next" disabled>Lanjut</button>
        </div>
      </div>
    `;
    return html;
  },

  attachHandlers(root, q, onNext) {
    const el = root.querySelector('[data-quiz]');
    if (!el) return;
    const feedback = el.querySelector('[data-role="feedback"]');
    const nextBtn = el.querySelector('[data-action="next"]');
    const ttsBtn = el.querySelector('[data-action="tts"]');

    async function playPrompt() {
      const s = Store.getSettings();
      const voice = await pickJaVoice(s.ttsVoice);
      await speakText(q.prompt, { voice, rate: s.ttsRate, pitch: s.ttsPitch, volume: s.ttsVolume });
    }

    ttsBtn?.addEventListener('click', playPrompt);

    function mark(correct) {
      feedback.textContent = correct ? 'Benar ✓' : `Salah ✗  Jawaban: ${q.answer}`;
      nextBtn.removeAttribute('disabled');
      // simpan progres sederhana
      // (M1: tanpa skor global; bisa ditambah di iterasi lanjut)
      try {
        const key = '/writing/kana';
        const prog = Store.getState().progress[key] || {};
        const score = (prog.score || 0) + (correct ? 1 : 0);
        Store.updateProgress(key, { score });
      } catch {}
    }

    if (q.type === 'choice') {
      el.querySelectorAll('[data-action="opt"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.getAttribute('data-val');
          mark(val?.toLowerCase() === q.answer.toLowerCase());
        });
      });
    } else {
      el.querySelector('[data-action="check"]')?.addEventListener('click', () => {
        const inp = el.querySelector('[data-role="answer"]');
        const val = (inp?.value || '').trim().toLowerCase();
        mark(val === q.answer.toLowerCase());
      });
    }

    nextBtn?.addEventListener('click', () => {
      stopSpeaking();
      onNext?.();
    });
  }
};