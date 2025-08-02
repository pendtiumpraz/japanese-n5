/**
 * Vocabulary N5 Page
 * - Browse vocabulary by category
 * - Flashcard view with TTS
 * - Practice quiz
 * - Search functionality
 */
import { VocabN5Complete as VocabN5, VocabCategoriesComplete as VocabCategories, filterByCategoryComplete as filterByCategory } from '../data/vocab_n5_complete.js';
import { Audio } from '../audio.js';
import { Store } from '../store.js';
import { Quiz } from '../quiz.js';

let currentCategory = 'all';
let currentIndex = 0;
let filteredVocab = VocabN5.slice();
let isQuizMode = false;
let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;

function renderCategoryFilter() {
  // Category icons are now in the categories data
  const allCategory = { id: 'all', name: 'Semua', icon: '🌏', count: VocabN5.length };
  const allCategories = [allCategory, ...VocabCategories];
  
  return `
    <div class="category-filter">
      ${allCategories.map(cat => `
        <div class="category-chip ${currentCategory === cat.id ? 'active' : ''}" 
             data-category="${cat.id}">
          <span class="category-icon">${cat.icon}</span>
          <span class="category-label">${cat.name}</span>
          <span class="category-count">${cat.count || filterByCategory(cat.id).length}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSearchBar() {
  return `
    <div class="row" style="margin-top:.75rem;">
      <input type="text" id="vocabSearch" 
             placeholder="Cari kata (JP/Romaji/Arti)..." 
             class="search-input" 
             style="flex:1; padding:.5rem; border:1px solid var(--border); border-radius:.5rem;">
      <button class="btn outline" id="btnClearSearch">Clear</button>
    </div>
  `;
}

function renderFlashcardView() {
  const vocab = filteredVocab[currentIndex];
  if (!vocab) {
    return `<div class="card"><p class="muted">Tidak ada kosakata untuk kategori ini.</p></div>`;
  }
  
  return `
    <div class="flashcard" id="vocabFlashcard">
      <div class="jp" style="font-size:clamp(28px, 6vw, 48px);">${vocab.jp}</div>
      <div class="romaji" style="font-size:1.1em; margin-top:.5rem;">${vocab.romaji}</div>
      <div class="meaning" style="font-size:1em; color:var(--text); margin-top:.25rem;">
        ${vocab.meaning}
      </div>
      <div class="actions" style="margin-top:1rem;">
        <button class="btn" data-action="speak" data-text="${vocab.jp}">
          🔊 Dengar
        </button>
        <button class="btn outline" data-action="prev">← Prev</button>
        <span style="margin:0 .5rem;">${currentIndex + 1}/${filteredVocab.length}</span>
        <button class="btn outline" data-action="next">Next →</button>
      </div>
    </div>
  `;
}

function renderQuizView() {
  if (quizIndex >= quizQuestions.length) {
    // Quiz completed
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    return `
      <div class="card">
        <h3>Kuis Selesai!</h3>
        <div class="row" style="margin-top:1rem;">
          <div>Skor: ${quizScore}/${quizQuestions.length} (${percentage}%)</div>
          <span class="space"></span>
          <button class="btn" id="btnRestartQuiz">Ulangi</button>
          <button class="btn outline" id="btnBackToFlashcards">Kembali</button>
        </div>
      </div>
    `;
  }
  
  const q = quizQuestions[quizIndex];
  return `
    <div class="card">
      <div class="row">
        <h4>Pertanyaan ${quizIndex + 1}/${quizQuestions.length}</h4>
        <span class="space"></span>
        <div class="muted">Skor: ${quizScore}</div>
      </div>
      ${Quiz.renderQuestion(q, quizIndex, quizQuestions.length)}
    </div>
  `;
}

function generateQuizQuestions(count = 10) {
  const questions = [];
  const vocab = filteredVocab.length > 0 ? filteredVocab : VocabN5;
  const pool = vocab.map(v => ({ 
    kana: v.jp, 
    romaji: v.romaji,
    meaning: v.meaning 
  }));
  
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const questionType = Math.random() > 0.5 ? 'jp-to-meaning' : 'meaning-to-jp';
    
    if (questionType === 'jp-to-meaning') {
      questions.push({
        type: 'choice',
        prompt: `Arti dari "${pool[idx].kana}" adalah:`,
        choices: generateChoices(pool, idx, 'meaning'),
        correct: pool[idx].meaning,
        kana: pool[idx].kana
      });
    } else {
      questions.push({
        type: 'choice',
        prompt: `Kata Jepang untuk "${pool[idx].meaning}" adalah:`,
        choices: generateChoices(pool, idx, 'kana'),
        correct: pool[idx].kana,
        kana: pool[idx].kana
      });
    }
  }
  
  return questions;
}

function generateChoices(pool, correctIdx, field) {
  const choices = [pool[correctIdx][field]];
  const used = new Set([correctIdx]);
  
  while (choices.length < 4 && used.size < pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    if (!used.has(idx)) {
      used.add(idx);
      choices.push(pool[idx][field]);
    }
  }
  
  // Shuffle choices
  return choices.sort(() => Math.random() - 0.5);
}

function searchVocab(query) {
  if (!query) {
    filteredVocab = filterByCategory(currentCategory);
    return;
  }
  
  const q = query.toLowerCase();
  filteredVocab = filterByCategory(currentCategory).filter(v => 
    v.jp.includes(query) || 
    v.romaji.toLowerCase().includes(q) || 
    v.meaning.toLowerCase().includes(q)
  );
  currentIndex = 0;
}

export const VocabPage = {
  render() {
    return `
      <section class="grid">
        <div class="card">
          <div class="row">
            <h3>Kosakata N5</h3>
            <span class="space"></span>
            <button class="btn ${isQuizMode ? 'outline' : ''}" id="btnFlashcardMode">
              📇 Flashcard
            </button>
            <button class="btn ${isQuizMode ? '' : 'outline'}" id="btnQuizMode">
              📝 Kuis
            </button>
          </div>
          <p class="muted">Pelajari ${VocabN5.length} kosakata JLPT N5 lengkap dengan kategori dan latihan.</p>
          
          <div style="margin-top:1rem;">
            ${renderCategoryFilter()}
            ${!isQuizMode ? renderSearchBar() : ''}
          </div>
        </div>
        
        <div id="vocabContent">
          ${isQuizMode ? renderQuizView() : renderFlashcardView()}
        </div>
        
        ${!isQuizMode ? `
          <div class="card">
            <h4>Tips Belajar Kosakata</h4>
            <ul style="margin-top:.5rem; padding-left:1.2rem;">
              <li>Gunakan tombol 🔊 untuk mendengar pengucapan</li>
              <li>Latih menulis kata dalam hiragana/katakana</li>
              <li>Buat kalimat sederhana dengan kata yang dipelajari</li>
              <li>Ulangi kuis secara berkala untuk mengingat</li>
            </ul>
          </div>
        ` : ''}
      </section>
    `;
  },

  onMount() {
    // Category filter handlers
    document.querySelectorAll('[data-category]').forEach(chip => {
      chip.addEventListener('click', () => {
        currentCategory = chip.getAttribute('data-category');
        filteredVocab = filterByCategory(currentCategory);
        currentIndex = 0;
        document.getElementById('vocabContent').innerHTML = renderFlashcardView();
        VocabPage.attachFlashcardHandlers();
        
        // Update active chip
        document.querySelectorAll('[data-category]').forEach(c => {
          c.classList.toggle('active', c === chip);
        });
      });
    });
    
    // Mode switchers
    document.getElementById('btnFlashcardMode')?.addEventListener('click', () => {
      isQuizMode = false;
      document.getElementById('vocabContent').innerHTML = renderFlashcardView();
      VocabPage.attachFlashcardHandlers();
      document.getElementById('btnFlashcardMode').classList.remove('outline');
      document.getElementById('btnQuizMode').classList.add('outline');
    });
    
    document.getElementById('btnQuizMode')?.addEventListener('click', () => {
      isQuizMode = true;
      quizQuestions = generateQuizQuestions(10);
      quizIndex = 0;
      quizScore = 0;
      document.getElementById('vocabContent').innerHTML = renderQuizView();
      VocabPage.attachQuizHandlers();
      document.getElementById('btnQuizMode').classList.remove('outline');
      document.getElementById('btnFlashcardMode').classList.add('outline');
    });
    
    // Search functionality
    const searchInput = document.getElementById('vocabSearch');
    searchInput?.addEventListener('input', (e) => {
      searchVocab(e.target.value);
      document.getElementById('vocabContent').innerHTML = renderFlashcardView();
      VocabPage.attachFlashcardHandlers();
    });
    
    document.getElementById('btnClearSearch')?.addEventListener('click', () => {
      document.getElementById('vocabSearch').value = '';
      searchVocab('');
      document.getElementById('vocabContent').innerHTML = renderFlashcardView();
      VocabPage.attachFlashcardHandlers();
    });
    
    // Initial handlers
    if (isQuizMode) {
      VocabPage.attachQuizHandlers();
    } else {
      VocabPage.attachFlashcardHandlers();
    }
  },
  
  attachFlashcardHandlers() {
    // Navigation
    document.querySelector('[data-action="prev"]')?.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        document.getElementById('vocabContent').innerHTML = renderFlashcardView();
        VocabPage.attachFlashcardHandlers();
      }
    });
    
    document.querySelector('[data-action="next"]')?.addEventListener('click', () => {
      if (currentIndex < filteredVocab.length - 1) {
        currentIndex++;
        document.getElementById('vocabContent').innerHTML = renderFlashcardView();
        VocabPage.attachFlashcardHandlers();
      }
    });
    
    // TTS
    document.querySelectorAll('[data-action="speak"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        Audio.speak(text);
      });
    });
  },
  
  attachQuizHandlers() {
    const wrap = document.getElementById('vocabContent');
    if (!wrap) return;
    
    // Handle quiz completion buttons
    document.getElementById('btnRestartQuiz')?.addEventListener('click', () => {
      quizQuestions = generateQuizQuestions(10);
      quizIndex = 0;
      quizScore = 0;
      wrap.innerHTML = renderQuizView();
      VocabPage.attachQuizHandlers();
    });
    
    document.getElementById('btnBackToFlashcards')?.addEventListener('click', () => {
      isQuizMode = false;
      wrap.innerHTML = renderFlashcardView();
      VocabPage.attachFlashcardHandlers();
      document.getElementById('btnFlashcardMode').classList.remove('outline');
      document.getElementById('btnQuizMode').classList.add('outline');
    });
    
    // Handle quiz question
    if (quizIndex < quizQuestions.length) {
      const q = quizQuestions[quizIndex];
      Quiz.attachHandlers(wrap, q, (isCorrect) => {
        if (isCorrect) quizScore++;
        quizIndex++;
        wrap.innerHTML = renderQuizView();
        VocabPage.attachQuizHandlers();
      });
    }
  }
};