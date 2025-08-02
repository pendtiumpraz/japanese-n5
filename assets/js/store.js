/**
 * Store sederhana berbasis localStorage
 * - Menyimpan settings, progress, bookmarks, notes
 * - Namespace versi untuk kemampuan migrasi
 */
const LS_KEY = "jpN5App:v1";

const defaultState = {
  userProfile: { name: null, streak: 0, lastActive: null },
  settings: {
    theme: "light",
    romaji: true,
    furigana: true,
    ttsVoice: null,
    ttsRate: 1,
    ttsPitch: 1,
    ttsVolume: 1
  },
  progress: {
    "/writing/kana": { score: 0, completedItems: [], lastVisited: null },
    "/writing/kanji": { score: 0, completedItems: [], lastVisited: null },
    "/speaking": { score: 0, completedItems: [], lastVisited: null },
    "/vocab": { score: 0, completedItems: [], lastVisited: null },
    "/grammar": { score: 0, completedItems: [], lastVisited: null }
  },
  bookmarks: [],
  notes: {}
};

function readLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    // Simple merge to keep compatibility with new keys
    return deepMerge(structuredClone(defaultState), parsed);
  } catch (e) {
    console.warn("Store read error:", e);
    return structuredClone(defaultState);
  }
}

function writeLS(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Store write error:", e);
  }
}

function deepMerge(base, extra) {
  Object.keys(extra || {}).forEach(k => {
    if (typeof base[k] === "object" && base[k] && !Array.isArray(base[k])) {
      base[k] = deepMerge(base[k], extra[k]);
    } else {
      base[k] = extra[k];
    }
  });
  return base;
}

let state = readLS();

export const Store = {
  getState() { return state; },
  setState(patch) {
    state = deepMerge(state, patch);
    writeLS(state);
  },

  getSettings() { return state.settings; },
  setSettings(patch) {
    state.settings = deepMerge(state.settings, patch);
    writeLS(state);
  },

  updateProgress(routeKey, patch) {
    state.progress[routeKey] = deepMerge(state.progress[routeKey] || {}, patch);
    state.progress[routeKey].lastVisited = Date.now();
    writeLS(state);
  },

  addBookmark(id) {
    if (!state.bookmarks.includes(id)) state.bookmarks.push(id);
    writeLS(state);
  },
  removeBookmark(id) {
    state.bookmarks = state.bookmarks.filter(x => x !== id);
    writeLS(state);
  },

  setNote(id, text) {
    state.notes[id] = text;
    writeLS(state);
  },
  deleteNote(id) {
    delete state.notes[id];
    writeLS(state);
  },

  export() {
    return JSON.stringify(state, null, 2);
  },
  import(json) {
    try {
      const obj = JSON.parse(json);
      state = deepMerge(structuredClone(defaultState), obj);
      writeLS(state);
      return true;
    } catch {
      return false;
    }
  }
};