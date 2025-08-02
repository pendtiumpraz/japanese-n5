/**
 * Speaking Page
 * - Simple speaking practice with recording using webkitSpeechRecognition
 * - Target phrases to imitate (shadowing) + basic scoring (Levenshtein similarity)
 * - Fallback message if recognition unsupported
 */
import { checkSupport, startRecognition, stopRecognition } from '../speak.js';
import { Store } from '../store.js';
import { pickJaVoice, speakText } from '../audio.js';

const samples = [
  { jp: 'こんにちは', romaji: 'konnichiwa', meaning: 'Halo' },
  { jp: 'おはようございます', romaji: 'ohayou gozaimasu', meaning: 'Selamat pagi' },
  { jp: 'ありがとうございます', romaji: 'arigatou gozaimasu', meaning: 'Terima kasih banyak' },
  { jp: 'すみません', romaji: 'sumimasen', meaning: 'Permisi / maaf' },
];

function distance(a, b) {
  // Levenshtein distance for basic scoring
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function similarity(a, b) {
  if (!a && !b) return 1;
  if (!a || !b) return 0;
  const d = distance(a, b);
  const maxLen = Math.max(a.length, b.length) || 1;
  return 1 - d / maxLen;
}

export const SpeakingPage = {
  render() {
    const supported = checkSupport();
    if (!supported) {
      return `
        <section class="card">
          <h3>Speaking</h3>
          <p class="muted">Browser tidak mendukung pengenalan suara (webkitSpeechRecognition).</p>
          <p class="muted">Gunakan latihan shadowing (TTS) untuk meniru pengucapan.</p>
        </section>
      `;
    }

    const list = samples.map((s, i) => `
      <div class="card" data-item="${i}">
        <div class="row">
          <div class="jp" style="font-size:32px;">${s.jp}</div>
          <span class="space"></span>
          <button class="btn" data-action="play" data-text="${s.jp}">▶️ Putar</button>
          <button class="btn outline" data-action="rec" data-target="${s.jp}">🎙️ Rekam</button>
        </div>
        <div class="muted">${s.romaji} — ${s.meaning}</div>
        <div class="row" style="margin-top:.5rem;">
          <div class="muted">Hasil:</div>
          <div data-role="result" style="font-weight:600;"></div>
          <span class="space"></span>
          <div class="muted">Skor:</div>
          <div data-role="score" style="font-weight:700;">0%</div>
        </div>
      </div>
    `).join('');

    return `
      <section class="grid">
        <div class="card">
          <h3>Speaking Practice</h3>
          <p class="muted">Putar TTS lalu rekam suara Anda; skor dihitung dari kemiripan transkrip.</p>
        </div>
        ${list}
      </section>
    `;
  },

  onMount() {
    // TTS play buttons
    document.querySelectorAll('[data-action="play"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-text') || '';
        const s = Store.getSettings();
        const voice = await pickJaVoice(s.ttsVoice);
        speakText(text, { voice, rate: s.ttsRate, pitch: s.ttsPitch, volume: s.ttsVolume });
      });
    });

    // Recording buttons
    document.querySelectorAll('[data-action="rec"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const card = btn.closest('[data-item]');
        if (!card) return;
        const target = (btn.getAttribute('data-target') || '').trim();
        const resEl = card.querySelector('[data-role="result"]');
        const scoreEl = card.querySelector('[data-role="score"]');

        resEl.textContent = '... merekam ...';
        const res = await startRecognition({ lang: 'ja-JP', interim: false, timeoutMs: 8000 });

        if (!res.supported) {
          resEl.textContent = 'Tidak didukung';
          return;
        }
        if (res.error || res.aborted) {
          resEl.textContent = 'Gagal merekam';
          return;
        }
        const heard = (res.text || '').trim();
        resEl.textContent = heard || '(kosong)';

        // Score: compare kana string; fallback compare romaji shapes by stripping spaces
        const score = similarity(heard, target);
        const pct = Math.round(score * 100);
        scoreEl.textContent = `${pct}%`;
      });
    });
  }
};