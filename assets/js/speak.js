/**
 * Speaking utils (stub untuk M1, penuh di M4)
 * - checkSupport: apakah SpeechRecognition tersedia
 * - startRecognition: mulai pengenalan suara ja-JP dan kembalikan transkrip
 * - stopRecognition: hentikan proses berjalan
 * Catatan: Banyak browser hanya mendukung webkitSpeechRecognition (Chrome/Edge).
 */

const RecognitionCtor = typeof window !== "undefined"
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

let recognition = null;
let activeResolve = null;

export function checkSupport() {
  return !!RecognitionCtor;
}

export function startRecognition({ lang = "ja-JP", interim = false, timeoutMs = 8000 } = {}) {
  if (!RecognitionCtor) {
    return Promise.resolve({ supported: false, text: "", confidence: 0 });
  }
  stopRecognition();

  recognition = new RecognitionCtor();
  recognition.lang = lang;
  recognition.interimResults = interim;
  recognition.maxAlternatives = 5;
  recognition.continuous = false;

  return new Promise(resolve => {
    activeResolve = resolve;
    let done = false;
    let best = { text: "", confidence: 0 };

    const finalize = (payload) => {
      if (done) return;
      done = true;
      try { recognition.stop(); } catch {}
      recognition = null;
      const res = activeResolve;
      activeResolve = null;
      res?.(payload);
    };

    recognition.onresult = (e) => {
      for (let i = 0; i < e.results.length; i++) {
        const result = e.results[i];
        if (!result.isFinal && !interim) continue;
        for (let j = 0; j < result.length; j++) {
          const alt = result[j];
          if ((alt.confidence || 0) > best.confidence) {
            best = { text: (alt.transcript || "").trim(), confidence: alt.confidence || 0 };
          }
        }
      }
    };

    recognition.onerror = () => finalize({ supported: true, error: true, text: best.text, confidence: best.confidence });
    recognition.onend = () => finalize({ supported: true, text: best.text, confidence: best.confidence });

    try {
      recognition.start();
    } catch {
      finalize({ supported: false, text: "", confidence: 0 });
    }

    if (timeoutMs > 0) {
      setTimeout(() => finalize({ supported: true, text: best.text, confidence: best.confidence, timeout: true }), timeoutMs);
    }
  });
}

export function stopRecognition() {
  try { recognition?.stop?.(); } catch {}
  recognition = null;
  if (activeResolve) {
    const res = activeResolve;
    activeResolve = null;
    res({ supported: !!RecognitionCtor, text: "", confidence: 0, aborted: true });
  }
}