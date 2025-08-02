/**
 * Fixed Kana Pages - all issues resolved
 */
import { Components } from './components.js';
import { Hiragana, Katakana } from '../data/kana.js';
import { Quiz } from '../quiz.js';
import { Store } from '../store.js';
import { StrokeTrainer, targetForA, targetForA_Kata } from '../write.js';

// Stroke patterns for multiple characters
const strokePatterns = {
  'あ': targetForA,
  'い': (w, h) => [
    [{x:w*0.3,y:h*0.2},{x:w*0.3,y:h*0.8}],
    [{x:w*0.7,y:h*0.3},{x:w*0.7,y:h*0.7}]
  ],
  'う': (w, h) => [
    [{x:w*0.5,y:h*0.2},{x:w*0.2,y:h*0.3},{x:w*0.2,y:h*0.7},{x:w*0.5,y:h*0.8}],
    [{x:w*0.8,y:h*0.4},{x:w*0.8,y:h*0.6}]
  ],
  'え': (w, h) => [
    [{x:w*0.2,y:h*0.3},{x:w*0.8,y:h*0.3}],
    [{x:w*0.5,y:h*0.2},{x:w*0.5,y:h*0.8},{x:w*0.7,y:h*0.7}]
  ],
  'お': (w, h) => [
    [{x:w*0.2,y:h*0.3},{x:w*0.8,y:h*0.3}],
    [{x:w*0.5,y:h*0.2},{x:w*0.5,y:h*0.8}],
    [{x:w*0.7,y:h*0.5},{x:w*0.7,y:h*0.7},{x:w*0.5,y:h*0.8}]
  ],
  'ア': targetForA_Kata,
  'イ': (w, h) => [
    [{x:w*0.2,y:h*0.3},{x:w*0.8,y:h*0.5}],
    [{x:w*0.7,y:h*0.2},{x:w*0.7,y:h*0.8}]
  ],
  'ウ': (w, h) => [
    [{x:w*0.2,y:h*0.2},{x:w*0.8,y:h*0.2}],
    [{x:w*0.5,y:h*0.3},{x:w*0.5,y:h*0.8}],
    [{x:w*0.2,y:h*0.7},{x:w*0.8,y:h*0.7}]
  ],
  'エ': (w, h) => [
    [{x:w*0.2,y:h*0.2},{x:w*0.8,y:h*0.2}],
    [{x:w*0.5,y:h*0.2},{x:w*0.5,y:h*0.8}],
    [{x:w*0.2,y:h*0.5},{x:w*0.8,y:h*0.5}]
  ],
  'オ': (w, h) => [
    [{x:w*0.2,y:h*0.3},{x:w*0.8,y:h*0.3}],
    [{x:w*0.2,y:h*0.7},{x:w*0.8,y:h*0.7}],
    [{x:w*0.6,y:h*0.2},{x:w*0.6,y:h*0.8},{x:w*0.3,y:h*0.6}]
  ]
};

function renderHeaderTabs(active) {
  return `
    <div class="row" style="margin-bottom:2rem;">
      <div class="row" role="tablist" aria-label="Kana Tabs" style="background:var(--surface-hover); padding:0.5rem; border-radius:var(--radius-lg);">
        <a href="#/writing/kana/hiragana" role="tab" aria-selected="${active==='hira'}" class="btn ${active==='hira'?'':'outline'}">ひらがな</a>
        <a href="#/writing/kana/katakana" role="tab" aria-selected="${active==='kata'}" class="btn ${active==='kata'?'':'outline'}">カタカナ</a>
      </div>
      <span class="space"></span>
      <a class="icon-btn" href="#/writing/kana" title="Ikhtisar">🏠</a>
    </div>
  `;
}

function flashcardsSection(type) {
  const settings = Store.getSettings();
  const source = type === 'hira' ? Hiragana : Katakana;
  const items = [];
  const pool = source.slice();
  while (items.length < Math.min(12, pool.length)) {
    const i = Math.floor(Math.random() * pool.length);
    items.push(pool.splice(i,1)[0]);
  }
  return `
    <section class="card" style="margin-bottom:3rem;">
      <h3>Flashcards ${type==='hira'?'Hiragana':'Katakana'}</h3>
      <p class="muted">Klik kartu untuk melihat romaji. Gunakan tombol untuk acak ulang.</p>
      <div class="row" style="margin-top:1rem;">
        <button class="btn" data-action="refresh">🔄 Acak Ulang</button>
        <span class="space"></span>
        <label class="row">
          <input type="checkbox" id="toggleRomaji" ${settings.romaji ? 'checked':''}/>
          <span> Tampilkan Romaji</span>
        </label>
      </div>
      <div class="grid cols-3" id="cardsWrap" style="margin-top:1.5rem; gap:1.5rem;">
        ${items.map(it => Components.Flashcard(it)).join('')}
      </div>
    </section>
  `;
}

function quizQuickSection(type) {
  const pool = type === 'hira' ? Hiragana : Katakana;
  const questions = [];
  for (let i=0;i<5;i++){
    const idx = Math.floor(Math.random()*pool.length);
    questions.push(i<3 ? Quiz.makeChoiceQuestion(pool, idx) : Quiz.makeTypingQuestion(pool, idx));
  }
  const key = type==='hira'?'__qq_hira':'__qq_kata';
  window[key] = questions;
  return `
    <section class="card" style="margin-bottom:3rem;">
      <h3>Kuis Cepat ${type==='hira'?'Hiragana':'Katakana'}</h3>
      <p class="muted">Test pemahaman dengan 5 pertanyaan acak</p>
      <div id="quizWrap" style="margin-top:1rem;"></div>
    </section>
  `;
}

function trainerSection(type) {
  const chars = type === 'hira' ? 
    ['あ', 'い', 'う', 'え', 'お'] : 
    ['ア', 'イ', 'ウ', 'エ', 'オ'];
  
  return `
    <section class="card" id="trainerCard" style="margin-bottom:3rem;">
      <div class="row">
        <h3>Latihan Stroke ${type==='hira'?'Hiragana':'Katakana'}</h3>
        <span class="space"></span>
        <button class="btn outline" id="btnResetTrace">Reset</button>
      </div>
      
      <div style="margin:1rem 0;">
        <span class="muted">Pilih karakter:</span>
        <div class="row" style="gap:0.5rem; margin-top:0.5rem; flex-wrap:wrap;">
          ${chars.map((char, idx) => `
            <button class="btn ${idx === 0 ? '' : 'outline'} small char-select" 
                    data-char="${char}" 
                    data-idx="${idx}"
                    style="width:50px; height:50px; font-size:1.5rem;">
              ${char}
            </button>
          `).join('')}
        </div>
      </div>
      
      <p class="muted" style="margin-top:0.5rem;">
        Karakter saat ini: <strong id="currentCharDisplay">${chars[0]}</strong>
      </p>
      
      <div class="row" style="margin-top:1rem; gap:1.5rem; align-items:flex-start;">
        <div id="trainerCanvasWrap" style="width:320px; height:320px; border:2px solid var(--border); border-radius:var(--radius);"></div>
        <div class="card" style="flex:1; min-height:120px;">
          <div class="row">
            <div class="muted">Skor</div>
            <span class="space"></span>
            <div id="trainerScore" style="font-weight:700; font-size:1.5rem;">0%</div>
          </div>
          <div style="margin-top:1rem;">
            <div class="muted">Tips</div>
            <ul style="margin-top:0.5rem; padding-left:1.5rem;">
              <li>Ikuti urutan stroke yang benar</li>
              <li>Gunakan jari (mobile) atau mouse</li>
              <li>Latih sampai skor 80%+</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `;
}

function dndSection(type) {
  return `
    <section class="card" id="dndCard" style="margin-bottom:3rem;">
      <h3>Drag & Drop ${type==='hira'?'Hiragana':'Katakana'}</h3>
      <div class="row" style="align-items:center; margin-bottom:1rem;">
        <p class="muted" style="margin:0;">Seret romaji ke kotak ${type==='hira'?'hiragana':'katakana'} yang sesuai.</p>
        <span class="space"></span>
        <button class="btn outline small" id="toggleDndHints" data-shown="true">
          <span class="hint-icon">👁️</span> <span class="hint-text">Sembunyikan Latin</span>
        </button>
      </div>
      <div id="${type==='hira'?'hiraDndWrap':'kataDndWrap'}" style="margin-top:1.5rem;">
        <!-- DnD content will be rendered -->
      </div>
    </section>
  `;
}

// Function to render DnD grid
function renderDnDGrid(type) {
  const source = type === 'hira' ? Hiragana : Katakana;
  const rows = [
    ['a','i','u','e','o'],
    ['ka','ki','ku','ke','ko'],
    ['sa','shi','su','se','so'],
    ['ta','chi','tsu','te','to'],
    ['na','ni','nu','ne','no']
  ];
  
  // Create kana map
  const kanaMap = {};
  source.forEach(k => { kanaMap[k.romaji] = k.kana; });
  
  // Get all romaji for options
  const allRomaji = rows.flat();
  const shuffled = [...allRomaji].sort(() => Math.random() - 0.5);
  
  return `
    <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:0.75rem; margin-bottom:1.5rem;">
      ${allRomaji.map(r => {
        const kana = kanaMap[r] || '?';
        return `
          <div class="dnd-cell" data-romaji="${r}" data-kana="${kana}"
               style="aspect-ratio:1; border:2px solid var(--border); border-radius:var(--radius); 
                      display:grid; place-items:center; font-size:1.5rem; font-weight:600;
                      background:var(--surface); transition:all 0.2s ease; position:relative;">
            <span class="kana-display" style="font-size:2rem; color:var(--primary);">${kana}</span>
            <span class="romaji-hint" style="position:absolute; bottom:4px; font-size:0.75rem; color:var(--muted); opacity:0.7; transition:opacity 0.2s ease;">${r}</span>
          </div>
        `;
      }).join('')}
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:0.5rem; justify-content:center; 
                padding:1rem; background:var(--surface-hover); border-radius:var(--radius);">
      ${shuffled.map(r => `
        <div class="dnd-chip" draggable="true" data-romaji="${r}"
             style="padding:0.5rem 1rem; background:white; border:2px solid var(--border); 
                    border-radius:var(--radius); cursor:move; font-weight:500;
                    transition:all 0.2s ease;">
          ${r}
        </div>
      `).join('')}
    </div>
    <div style="margin-top:1rem; text-align:center;">
      <span style="color:var(--success); margin-right:1rem;">✓ Benar: <strong id="dndCorrect">0</strong></span>
      <span style="color:var(--error);">✗ Salah: <strong id="dndWrong">0</strong></span>
    </div>
  `;
}

export const KanaSplitPages = {
  renderHiragana() {
    return `
      <div style="padding:0.5rem 0;">
        ${renderHeaderTabs('hira')}
        ${flashcardsSection('hira')}
        ${quizQuickSection('hira')}
        ${trainerSection('hira')}
        ${dndSection('hira')}
      </div>
    `;
  },
  
  renderKatakana() {
    return `
      <div style="padding:0.5rem 0;">
        ${renderHeaderTabs('kata')}
        ${flashcardsSection('kata')}
        ${quizQuickSection('kata')}
        ${trainerSection('kata')}
        ${dndSection('kata')}
      </div>
    `;
  },

  onMountHiragana() {
    // Flashcard behaviors
    Components.attachFlashcardBehavior();
    
    // Toggle romaji
    document.getElementById('toggleRomaji')?.addEventListener('change', (e) => {
      Store.setSettings({ romaji: e.target.checked });
      window.__appNavigate?.('/writing/kana/hiragana', { r: Math.random().toString(36).slice(2,6) });
    });
    
    // Refresh
    document.querySelector('[data-action="refresh"]')?.addEventListener('click', () => {
      window.__appNavigate?.('/writing/kana/hiragana', { r: Math.random().toString(36).slice(2,6) });
    });
    
    // Quiz
    const qs = window.__qq_hira || [];
    const quizWrap = document.getElementById('quizWrap');
    let qIdx = 0;
    const renderNext = () => {
      if (!quizWrap) return;
      if (qIdx >= qs.length) {
        quizWrap.innerHTML = `
          <div class="card" style="text-align:center; padding:2rem;">
            <div style="font-size:2rem;">✅ Selesai!</div>
            <button class="btn" id="btnAgain" style="margin-top:1rem;">Ulangi</button>
          </div>
        `;
        document.getElementById('btnAgain')?.addEventListener('click', () => {
          window.__appNavigate?.('/writing/kana/hiragana', { q: Math.random().toString(36).slice(2,6) });
        });
        return;
      }
      const q = qs[qIdx];
      quizWrap.innerHTML = Quiz.renderQuestion(q, qIdx, qs.length);
      Quiz.attachHandlers(quizWrap, q, () => { qIdx++; renderNext(); });
    };
    renderNext();
    
    // Trainer with multiple characters
    let currentTrainer = null;
    let currentChar = 'あ';
    
    function loadTrainer(char) {
      const strokeFn = strokePatterns[char] || strokePatterns['あ'];
      const wrap = document.getElementById('trainerCanvasWrap');
      if (!wrap) return;
      
      // Clear previous
      wrap.innerHTML = '';
      
      currentTrainer = new StrokeTrainer({ 
        width: 320, 
        height: 320, 
        target: strokeFn(320, 320) 
      });
      currentTrainer.onScore = (s) => {
        const el = document.getElementById('trainerScore');
        if (el) el.textContent = Math.round(s*100)+'%';
      };
      currentTrainer.mount(wrap);
      document.getElementById('currentCharDisplay').textContent = char;
    }
    
    // Character selection
    document.querySelectorAll('.char-select').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.char-select').forEach(b => b.classList.add('outline'));
        btn.classList.remove('outline');
        currentChar = btn.dataset.char;
        loadTrainer(currentChar);
      });
    });
    
    // Initial load
    loadTrainer('あ');
    
    // Reset button
    document.getElementById('btnResetTrace')?.addEventListener('click', () => {
      if (currentTrainer) {
        currentTrainer.reset();
        document.getElementById('trainerScore').textContent = '0%';
      }
    });
    
    // DnD Hiragana
    const dndWrap = document.getElementById('hiraDndWrap');
    if (dndWrap) {
      dndWrap.innerHTML = renderDnDGrid('hira');
      
      // Toggle hints button
      const toggleBtn = document.getElementById('toggleDndHints');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const isShown = toggleBtn.dataset.shown === 'true';
          const hints = dndWrap.querySelectorAll('.romaji-hint');
          hints.forEach(hint => {
            hint.style.opacity = isShown ? '0' : '0.7';
          });
          toggleBtn.dataset.shown = isShown ? 'false' : 'true';
          toggleBtn.querySelector('.hint-text').textContent = isShown ? 'Tampilkan Latin' : 'Sembunyikan Latin';
        });
      }
      
      let draggedEl = null;
      let correct = 0;
      let wrong = 0;
      
      // Drag handlers
      dndWrap.querySelectorAll('.dnd-chip').forEach(chip => {
        chip.addEventListener('dragstart', e => {
          draggedEl = e.target;
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', e.target.dataset.romaji);
          e.target.style.opacity = '0.5';
        });
        chip.addEventListener('dragend', e => {
          e.target.style.opacity = '1';
          draggedEl = null;
        });
      });
      
      // Drop handlers
      dndWrap.querySelectorAll('.dnd-cell').forEach(cell => {
        cell.addEventListener('dragover', e => {
          e.preventDefault();
          cell.style.background = 'var(--primary-50)';
          cell.style.transform = 'scale(1.05)';
        });
        cell.addEventListener('dragleave', e => {
          cell.style.background = 'var(--surface)';
          cell.style.transform = '';
        });
        cell.addEventListener('drop', e => {
          e.preventDefault();
          cell.style.transform = '';
          
          const droppedRomaji = e.dataTransfer.getData('text/plain');
          if (draggedEl && droppedRomaji === cell.dataset.romaji) {
            // Correct!
            cell.style.background = 'var(--success-light)';
            cell.style.border = '2px solid var(--success)';
            const hint = cell.querySelector('.romaji-hint');
            if (hint) hint.style.opacity = '0';
            draggedEl.remove();
            draggedEl = null;
            correct++;
            document.getElementById('dndCorrect').textContent = correct;
          } else {
            // Wrong
            cell.style.background = 'var(--error-light)';
            wrong++;
            document.getElementById('dndWrong').textContent = wrong;
            setTimeout(() => {
              cell.style.background = 'var(--surface)';
            }, 500);
          }
        });
      });
    }
  },
  
  onMountKatakana() {
    // Similar to Hiragana
    Components.attachFlashcardBehavior();
    
    document.getElementById('toggleRomaji')?.addEventListener('change', (e) => {
      Store.setSettings({ romaji: e.target.checked });
      window.__appNavigate?.('/writing/kana/katakana', { r: Math.random().toString(36).slice(2,6) });
    });
    
    document.querySelector('[data-action="refresh"]')?.addEventListener('click', () => {
      window.__appNavigate?.('/writing/kana/katakana', { r: Math.random().toString(36).slice(2,6) });
    });
    
    // Quiz for Katakana
    const pool = Katakana;
    const questions = [];
    for (let i=0;i<5;i++){
      const idx = Math.floor(Math.random()*pool.length);
      questions.push(i<3 ? Quiz.makeChoiceQuestion(pool, idx) : Quiz.makeTypingQuestion(pool, idx));
    }
    const quizWrap = document.getElementById('quizWrap');
    let qIdx = 0;
    const renderNext = () => {
      if (!quizWrap) return;
      if (qIdx >= questions.length) {
        quizWrap.innerHTML = `
          <div class="card" style="text-align:center; padding:2rem;">
            <div style="font-size:2rem;">✅ Selesai!</div>
            <button class="btn" id="btnAgain" style="margin-top:1rem;">Ulangi</button>
          </div>
        `;
        document.getElementById('btnAgain')?.addEventListener('click', () => {
          window.__appNavigate?.('/writing/kana/katakana', { q: Math.random().toString(36).slice(2,6) });
        });
        return;
      }
      const q = questions[qIdx];
      quizWrap.innerHTML = Quiz.renderQuestion(q, qIdx, questions.length);
      Quiz.attachHandlers(quizWrap, q, () => { qIdx++; renderNext(); });
    };
    renderNext();
    
    // Trainer for Katakana
    let currentTrainer = null;
    let currentChar = 'ア';
    
    function loadTrainer(char) {
      const strokeFn = strokePatterns[char] || strokePatterns['ア'];
      const wrap = document.getElementById('trainerCanvasWrap');
      if (!wrap) return;
      
      // Clear previous
      wrap.innerHTML = '';
      
      currentTrainer = new StrokeTrainer({ 
        width: 320, 
        height: 320, 
        target: strokeFn(320, 320) 
      });
      currentTrainer.onScore = (s) => {
        const el = document.getElementById('trainerScore');
        if (el) el.textContent = Math.round(s*100)+'%';
      };
      currentTrainer.mount(wrap);
      document.getElementById('currentCharDisplay').textContent = char;
    }
    
    // Character selection
    document.querySelectorAll('.char-select').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.char-select').forEach(b => b.classList.add('outline'));
        btn.classList.remove('outline');
        currentChar = btn.dataset.char;
        loadTrainer(currentChar);
      });
    });
    
    // Initial load
    loadTrainer('ア');
    
    // Reset button
    document.getElementById('btnResetTrace')?.addEventListener('click', () => {
      if (currentTrainer) {
        currentTrainer.reset();
        document.getElementById('trainerScore').textContent = '0%';
      }
    });
    
    // DnD Katakana
    const dndWrap = document.getElementById('kataDndWrap');
    if (dndWrap) {
      dndWrap.innerHTML = renderDnDGrid('kata');
      
      // Toggle hints button
      const toggleBtn = document.getElementById('toggleDndHints');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const isShown = toggleBtn.dataset.shown === 'true';
          const hints = dndWrap.querySelectorAll('.romaji-hint');
          hints.forEach(hint => {
            hint.style.opacity = isShown ? '0' : '0.7';
          });
          toggleBtn.dataset.shown = isShown ? 'false' : 'true';
          toggleBtn.querySelector('.hint-text').textContent = isShown ? 'Tampilkan Latin' : 'Sembunyikan Latin';
        });
      }
      
      let draggedEl = null;
      let correct = 0;
      let wrong = 0;
      
      // Drag handlers
      dndWrap.querySelectorAll('.dnd-chip').forEach(chip => {
        chip.addEventListener('dragstart', e => {
          draggedEl = e.target;
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', e.target.dataset.romaji);
          e.target.style.opacity = '0.5';
        });
        chip.addEventListener('dragend', e => {
          e.target.style.opacity = '1';
          draggedEl = null;
        });
      });
      
      // Drop handlers
      dndWrap.querySelectorAll('.dnd-cell').forEach(cell => {
        cell.addEventListener('dragover', e => {
          e.preventDefault();
          cell.style.background = 'var(--primary-50)';
          cell.style.transform = 'scale(1.05)';
        });
        cell.addEventListener('dragleave', e => {
          cell.style.background = 'var(--surface)';
          cell.style.transform = '';
        });
        cell.addEventListener('drop', e => {
          e.preventDefault();
          cell.style.transform = '';
          
          const droppedRomaji = e.dataTransfer.getData('text/plain');
          if (draggedEl && droppedRomaji === cell.dataset.romaji) {
            // Correct!
            cell.style.background = 'var(--success-light)';
            cell.style.border = '2px solid var(--success)';
            const hint = cell.querySelector('.romaji-hint');
            if (hint) hint.style.opacity = '0';
            draggedEl.remove();
            draggedEl = null;
            correct++;
            document.getElementById('dndCorrect').textContent = correct;
          } else {
            // Wrong
            cell.style.background = 'var(--error-light)';
            wrong++;
            document.getElementById('dndWrong').textContent = wrong;
            setTimeout(() => {
              cell.style.background = 'var(--surface)';
            }, 500);
          }
        });
      });
    }
  }
};