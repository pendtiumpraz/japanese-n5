/**
 * Pages: renderer sederhana per route
 * - render(route): return HTML string
 * - onMount(route): attach event listeners setelah render
 */
import { Store } from '../store.js';
import { navigate } from '../router.js';
import { KanaFlashcardsPage } from './kana_flashcards.js';
import { KanaTrainer } from './kana_trainer.js';
import { KanaDnDQuiz } from './kana_dnd_quiz.js';
import { KanaFilter } from './kana_filter.js';
import { KanaSplitPages } from './kana_pages_fixed.js';
import { GrammarPage } from './grammar_page.js';
import { SpeakingPage } from './speaking_page.js';
import { DialogPage } from './dialog_page.js';
import { KanjiPage } from './kanji_page_fixed.js';
import { VocabPage } from './vocab_page.js';
import { ReviewPage } from './review_page.js';
function homePage() {
  return `
    <section class="hero-section">
      <div class="hero-card">
        <div class="hero-icon">🌸</div>
        <h1 class="hero-title">Selamat Datang di JP N5! 👋</h1>
        <p class="hero-subtitle">Belajar Bahasa Jepang level N5 dengan mudah dan menyenangkan</p>
        
        <div class="quick-stats">
          <div class="stat-item">
            <div class="stat-icon">📝</div>
            <div class="stat-value">92</div>
            <div class="stat-label">Kana</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🈷</div>
            <div class="stat-value">100</div>
            <div class="stat-label">Kanji</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">💬</div>
            <div class="stat-value">800+</div>
            <div class="stat-label">Kosakata</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🎯</div>
            <div class="stat-value">7</div>
            <div class="stat-label">Modul</div>
          </div>
        </div>
        
        <div class="hero-actions">
          <button class="btn large" data-action="goto" data-path="/writing/kana">
            <span style="font-size:1.2em;">🚀</span> Mulai Belajar
          </button>
          <button class="btn outline" data-action="goto" data-path="/review">
            <span style="font-size:1.2em;">📊</span> Lihat Progress
          </button>
        </div>
      </div>

      <h2 class="section-title">📚 Pilih Modul Pembelajaran</h2>
      
      <div class="module-grid">
        ${[
          {title:'Writing Kana', path:'/writing/kana', desc:'Hiragana & Katakana', icon:'✍️', color:'blue'},
          {title:'Writing Kanji', path:'/writing/kanji', desc:'100 Kanji N5', icon:'🈷', color:'purple'},
          {title:'Speaking', path:'/speaking', desc:'Latihan Berbicara', icon:'🗣️', color:'green'},
          {title:'Listening', path:'/listening', desc:'Dialog & Shadowing', icon:'👂', color:'orange'},
          {title:'Kosakata', path:'/vocab', desc:'Vocabulary N5', icon:'📖', color:'red'},
          {title:'Grammar', path:'/grammar', desc:'Tata Bahasa', icon:'📐', color:'indigo'},
          {title:'Review', path:'/review', desc:'Progress & Quiz', icon:'🎯', color:'pink'}
        ].map(m => `
          <div class="module-card module-${m.color}" data-action="goto" data-path="${m.path}">
            <div class="module-icon">${m.icon}</div>
            <div class="module-content">
              <h3 class="module-title">${m.title}</h3>
              <p class="module-desc">${m.desc}</p>
            </div>
            <div class="module-arrow">→</div>
          </div>
        `).join('')}
      </div>

      <div class="card">
        <h3>Tips</h3>
        <ul style="margin-top:.5rem; padding-left:1rem;">
          <li>Gunakan <span class="kbd">Tab</span> lalu <span class="kbd">Enter</span> untuk navigasi cepat.</li>
          <li>Aktifkan suara Jepang (ja-JP) di Settings untuk kualitas TTS terbaik.</li>
          <li>Jika pengenalan suara tidak tersedia di browser, gunakan latihan shadowing & self-check.</li>
        </ul>
      </div>
    </section>
  `;
}

function kanaPage() {
  // Halaman ikhtisar kana -> tautan ke Hira/Kata
  return `
    <section class="grid">
      <div class="card">
        <h3>Writing Kana</h3>
        <p class="muted">Pilih Hiragana atau Katakana untuk mulai belajar.</p>
        <div class="row" style="margin-top:.75rem;">
          <a class="btn" href="#/writing/kana/hiragana">Hiragana</a>
          <a class="btn outline" href="#/writing/kana/katakana">Katakana</a>
        </div>
      </div>

      <div class="card">
        <h3>Pintasan</h3>
        <div class="grid cols-2" style="margin-top:.5rem;">
          <div class="flashcard">
            <div class="romaji" style="font-weight:600">Hiragana</div>
            <div class="meaning">Flashcards + Kuis + Stroke + DnD</div>
            <div class="actions">
              <a class="btn" href="#/writing/kana/hiragana">Buka</a>
            </div>
          </div>
          <div class="flashcard">
            <div class="romaji" style="font-weight:600">Katakana</div>
            <div class="meaning">Flashcards + Kuis + Stroke + DnD</div>
            <div class="actions">
              <a class="btn outline" href="#/writing/kana/katakana">Buka</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function settingsPage() {
  const s = Store.getSettings();
  return `
    <section class="grid">
      <div class="card">
        <h3>Pengaturan</h3>
        <div class="grid cols-2" style="margin-top:.75rem;">
          <label class="row">
            <input type="checkbox" id="optRomaji" ${s.romaji ? 'checked':''}/>
            <span> Tampilkan Romaji</span>
          </label>
          <label class="row">
            <input type="checkbox" id="optFurigana" ${s.furigana ? 'checked':''}/>
            <span> Tampilkan Furigana</span>
          </label>
          <label class="row">
            <span class="space">Kecepatan TTS</span>
            <input type="range" id="optTtsRate" min="0.6" max="1.4" step="0.1" value="${s.ttsRate}"/>
          </label>
          <label class="row">
            <span class="space">Pitch TTS</span>
            <input type="range" id="optTtsPitch" min="0.6" max="1.4" step="0.1" value="${s.ttsPitch}"/>
          </label>
          <label class="row">
            <span class="space">Volume TTS</span>
            <input type="range" id="optTtsVolume" min="0" max="1" step="0.05" value="${s.ttsVolume}"/>
          </label>
        </div>
        <div class="row" style="margin-top:.75rem;">
          <button class="btn" id="btnSaveSettings">Simpan</button>
        </div>
      </div>
    </section>
  `;
}

export const Pages = {
  render(route) {
    switch (route.path) {
      case '/':
      case '': return homePage();
      case '/settings': return settingsPage();
      case '/writing/kana': return kanaPage();
      case '/writing/kana/hiragana': return KanaSplitPages.renderHiragana?.() || '<section class="card"><h3>Hiragana</h3><p class="muted">Memuat...</p></section>';
      case '/writing/kana/katakana': return KanaSplitPages.renderKatakana?.() || '<section class="card"><h3>Katakana</h3><p class="muted">Memuat...</p></section>';
      // Placeholder route sampai modul lain diimplementasikan
      case '/writing/kanji': return KanjiPage.render?.() || '<section class="card"><h3>Writing Kanji (N5)</h3><p class="muted">Memuat...</p></section>';
      case '/speaking': return SpeakingPage.render();
      case '/vocab': return VocabPage.render();
      case '/grammar': return GrammarPage.render?.() || '<section class="card"><h3>Grammar</h3><p class="muted">Memuat...</p></section>';
      case '/listening': return DialogPage.render?.() || '<section class="card"><h3>Listening</h3><p class="muted">Memuat...</p></section>';
      case '/review': return ReviewPage.render();
      default:
        return `<section class="card"><h3>404</h3><p class="muted">Halaman tidak ditemukan.</p></section>`;
    }
  },

  onMount(route) {
    // Delegasi klik tombol "Buka"
    document.querySelectorAll('[data-action="goto"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const path = btn.getAttribute('data-path') || '/';
        navigate(path);
      });
    });

    // Hook untuk halaman Writing Kana split
    if (route.path === '/writing/kana/hiragana') {
      KanaSplitPages.onMountHiragana?.();
    } else if (route.path === '/writing/kana/katakana') {
      KanaSplitPages.onMountKatakana?.();
    } else if (route.path === '/writing/kana') {
      // tidak ada onMount khusus untuk ikhtisar
    }

    // Settings listeners
    if (route.path === '/settings') {
      const btnSave = document.getElementById('btnSaveSettings');
      btnSave?.addEventListener('click', () => {
        const romaji = document.getElementById('optRomaji')?.checked ?? true;
        const furigana = document.getElementById('optFurigana')?.checked ?? true;
        const ttsRate = parseFloat(document.getElementById('optTtsRate')?.value || '1');
        const ttsPitch = parseFloat(document.getElementById('optTtsPitch')?.value || '1');
        const ttsVolume = parseFloat(document.getElementById('optTtsVolume')?.value || '1');
        Store.setSettings({ romaji, furigana, ttsRate, ttsPitch, ttsVolume });
        // Feedback sederhana
        btnSave.textContent = 'Tersimpan ✓';
        setTimeout(() => (btnSave.textContent = 'Simpan'), 1200);
      });
    }

    // Grammar listeners
    if (route.path === '/grammar') {
      try {
        GrammarPage?.onMount?.();
      } catch (e) {
        console.warn('GrammarPage onMount failed:', e);
      }
    }

    // Speaking listeners
    if (route.path === '/speaking') {
      try {
        SpeakingPage?.onMount?.();
      } catch (e) {
        console.warn('SpeakingPage onMount failed:', e);
      }
    }

    // Listening / Dialog listeners
    if (route.path === '/listening') {
      try {
        DialogPage?.onMount?.();
      } catch (e) {
        console.warn('DialogPage onMount failed:', e);
      }
    }

    // Kanji listeners
    if (route.path === '/writing/kanji') {
      try {
        KanjiPage?.onMount?.();
      } catch (e) {
        console.warn('KanjiPage onMount failed:', e);
      }
    }
    
    // Vocab listeners
    if (route.path === '/vocab') {
      try {
        VocabPage?.onMount?.();
      } catch (e) {
        console.warn('VocabPage onMount failed:', e);
      }
    }
    
    // Review listeners
    if (route.path === '/review') {
      try {
        ReviewPage?.onMount?.();
      } catch (e) {
        console.warn('ReviewPage onMount failed:', e);
      }
    }
  }
};