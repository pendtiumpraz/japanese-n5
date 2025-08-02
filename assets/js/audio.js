/**
 * Audio utilities: TTS (ja-JP) dengan Web Speech API
 * - pickJaVoice: memilih suara Jepang
 * - speakText: memutar teks dengan pengaturan
 * - stopSpeaking: menghentikan TTS
 * Catatan: dukungan TTS tersedia luas; pilih voice ja-JP terbaik jika ada.
 */

let cachedVoices = [];
let voicesReady = false;

function loadVoices() {
  cachedVoices = window.speechSynthesis?.getVoices?.() || [];
  voicesReady = cachedVoices.length > 0;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    loadVoices();
  });
}

export async function pickJaVoice(preferredName = null) {
  // Tunggu sampai daftar voice siap (di beberapa browser async)
  for (let i = 0; i < 10 && !voicesReady; i++) {
    await new Promise(r => setTimeout(r, 100));
    loadVoices();
  }
  const voices = cachedVoices;
  if (!voices || voices.length === 0) return null;

  const byLang = voices.filter(v => (v.lang || "").toLowerCase().startsWith("ja"));
  if (byLang.length === 0) return null;

  if (preferredName) {
    const pref = byLang.find(v => v.name === preferredName);
    if (pref) return pref;
  }

  // Prioritaskan Google atau Microsoft jika ada
  const preferredVendors = ["google", "microsoft", "apple"];
  for (const vendor of preferredVendors) {
    const found = byLang.find(v => v.name.toLowerCase().includes(vendor));
    if (found) return found;
  }

  return byLang[0];
}

let currentUtterance = null;

export function speakText(text, opts = {}) {
  if (!("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis API tidak tersedia.");
    return;
  }
  stopSpeaking();

  const u = new SpeechSynthesisUtterance(text);
  if (opts.voice) u.voice = opts.voice;
  u.lang = "ja-JP";
  u.rate = opts.rate ?? 1;
  u.pitch = opts.pitch ?? 1;
  u.volume = opts.volume ?? 1;

  currentUtterance = u;
  window.speechSynthesis.speak(u);
  return new Promise(resolve => {
    u.onend = () => { if (currentUtterance === u) currentUtterance = null; resolve(); };
    u.onerror = () => { if (currentUtterance === u) currentUtterance = null; resolve(); };
  });
}

export function stopSpeaking() {
  try {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  } catch {}
  currentUtterance = null;
}

// Export as Audio object for compatibility
export const Audio = {
  speak: (text, opts = {}) => speakText(text, opts),
  stop: () => stopSpeaking(),
  pickVoice: (name) => pickJaVoice(name)
};