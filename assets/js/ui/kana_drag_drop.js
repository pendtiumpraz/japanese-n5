/**
 * Kana Drag & Drop Quiz
 * - Interactive drag-and-drop matching quiz for kana
 * - Touch and mouse support
 * - Visual feedback and scoring
 */
import { KanaData } from '../data/kana.js';
import { Audio } from '../audio.js';
import { Store } from '../store.js';
import { ReviewPage } from './review_page.js';

let currentSet = 'hiragana';
let quizItems = [];
let matches = {};
let score = 0;
let totalQuestions = 10;
let draggedItem = null;

function generateQuizItems(type = 'hiragana', count = 10) {
  const pool = type === 'hiragana' ? KanaData.hiragana : KanaData.katakana;
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function renderDragDropQuiz() {
  const kanaItems = quizItems.map((item, idx) => ({
    id: `kana-${idx}`,
    text: item.kana,
    type: 'kana',
    data: item
  }));
  
  const romajiItems = quizItems.map((item, idx) => ({
    id: `romaji-${idx}`,
    text: item.romaji,
    type: 'romaji',
    data: item
  }));
  
  // Shuffle romaji items
  romajiItems.sort(() => Math.random() - 0.5);
  
  return `
    <div class="dnd-container">
      <div class="dnd-column">
        <h4>Kana</h4>
        <div class="dnd-items" id="kanaColumn">
          ${kanaItems.map(item => `
            <div class="dnd-item ${matches[item.id] ? 'matched' : ''}" 
                 data-id="${item.id}"
                 data-kana="${item.data.kana}"
                 draggable="true">
              <span class="jp" style="font-size:2em;">${item.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="dnd-column">
        <h4>Romaji</h4>
        <div class="dnd-items" id="romajiColumn">
          ${romajiItems.map(item => `
            <div class="dnd-item draggable ${matches[item.id] ? 'matched' : ''}" 
                 data-id="${item.id}"
                 data-romaji="${item.data.romaji}"
                 draggable="true">
              <span style="font-size:1.2em;">${item.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    
    <div class="dnd-status">
      <div class="row">
        <div>Skor: ${score}/${totalQuestions}</div>
        <span class="space"></span>
        <button class="btn outline" id="btnCheckAnswers">Periksa</button>
        <button class="btn" id="btnResetDnD">Reset</button>
      </div>
    </div>
  `;
}

function attachDragDropHandlers() {
  const items = document.querySelectorAll('.dnd-item');
  
  items.forEach(item => {
    // Mouse events
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragend', handleDragEnd);
    
    // Touch events
    item.addEventListener('touchstart', handleTouchStart, { passive: false });
    item.addEventListener('touchmove', handleTouchMove, { passive: false });
    item.addEventListener('touchend', handleTouchEnd);
  });
  
  // Button handlers
  document.getElementById('btnCheckAnswers')?.addEventListener('click', checkAnswers);
  document.getElementById('btnResetDnD')?.addEventListener('click', resetQuiz);
}

function handleDragStart(e) {
  draggedItem = e.target;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  
  const afterElement = getDragAfterElement(e.currentTarget.parentElement, e.clientY);
  if (afterElement == null) {
    e.currentTarget.parentElement.appendChild(draggedItem);
  } else {
    e.currentTarget.parentElement.insertBefore(draggedItem, afterElement);
  }
  
  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  
  if (draggedItem !== e.target) {
    // Check if they can be matched
    const draggedKana = draggedItem.dataset.kana;
    const draggedRomaji = draggedItem.dataset.romaji;
    const targetKana = e.target.dataset.kana;
    const targetRomaji = e.target.dataset.romaji;
    
    if ((draggedKana && targetRomaji) || (draggedRomaji && targetKana)) {
      // Potential match - highlight both
      draggedItem.classList.add('potential-match');
      e.target.classList.add('potential-match');
    }
  }
  
  return false;
}

function handleDragEnd(e) {
  const items = document.querySelectorAll('.dnd-item');
  items.forEach(item => {
    item.classList.remove('dragging');
    item.classList.remove('potential-match');
  });
}

// Touch handling
let touchItem = null;
let touchOffset = { x: 0, y: 0 };

function handleTouchStart(e) {
  const touch = e.touches[0];
  touchItem = e.target.closest('.dnd-item');
  if (!touchItem) return;
  
  const rect = touchItem.getBoundingClientRect();
  touchOffset.x = touch.clientX - rect.left;
  touchOffset.y = touch.clientY - rect.top;
  
  touchItem.classList.add('dragging');
  touchItem.style.position = 'fixed';
  touchItem.style.zIndex = '1000';
  
  e.preventDefault();
}

function handleTouchMove(e) {
  if (!touchItem) return;
  
  const touch = e.touches[0];
  touchItem.style.left = `${touch.clientX - touchOffset.x}px`;
  touchItem.style.top = `${touch.clientY - touchOffset.y}px`;
  
  e.preventDefault();
}

function handleTouchEnd(e) {
  if (!touchItem) return;
  
  const touch = e.changedTouches[0];
  const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
  const dropTarget = elementBelow?.closest('.dnd-item');
  
  if (dropTarget && dropTarget !== touchItem) {
    // Check match
    const draggedKana = touchItem.dataset.kana;
    const draggedRomaji = touchItem.dataset.romaji;
    const targetKana = dropTarget.dataset.kana;
    const targetRomaji = dropTarget.dataset.romaji;
    
    if ((draggedKana && targetRomaji) || (draggedRomaji && targetKana)) {
      touchItem.classList.add('potential-match');
      dropTarget.classList.add('potential-match');
    }
  }
  
  // Reset position
  touchItem.style.position = '';
  touchItem.style.zIndex = '';
  touchItem.style.left = '';
  touchItem.style.top = '';
  touchItem.classList.remove('dragging');
  
  touchItem = null;
  e.preventDefault();
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.dnd-item:not(.dragging)')];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function checkAnswers() {
  const items = document.querySelectorAll('.dnd-item.potential-match');
  const correctMatches = [];
  
  // Group potential matches by pairs
  const pairs = [];
  items.forEach(item => {
    const kana = item.dataset.kana;
    const romaji = item.dataset.romaji;
    
    if (kana) {
      const romajiMatch = [...items].find(i => 
        i.dataset.romaji && i.classList.contains('potential-match')
      );
      if (romajiMatch) {
        pairs.push({ kana: item, romaji: romajiMatch });
      }
    }
  });
  
  // Check each pair
  pairs.forEach(pair => {
    const kanaData = quizItems.find(q => q.kana === pair.kana.dataset.kana);
    if (kanaData && kanaData.romaji === pair.romaji.dataset.romaji) {
      pair.kana.classList.add('correct');
      pair.romaji.classList.add('correct');
      pair.kana.classList.remove('potential-match');
      pair.romaji.classList.remove('potential-match');
      correctMatches.push(pair);
    } else {
      pair.kana.classList.add('incorrect');
      pair.romaji.classList.add('incorrect');
      setTimeout(() => {
        pair.kana.classList.remove('incorrect', 'potential-match');
        pair.romaji.classList.remove('incorrect', 'potential-match');
      }, 1000);
    }
  });
  
  score += correctMatches.length;
  updateScore();
  
  // Check if quiz is complete
  if (document.querySelectorAll('.dnd-item.correct').length >= totalQuestions * 2) {
    setTimeout(() => {
      alert(`Kuis selesai! Skor akhir: ${score}/${totalQuestions}`);
      // Update progress
      ReviewPage.recordKanaStudied(totalQuestions);
    }, 500);
  }
}

function updateScore() {
  const statusDiv = document.querySelector('.dnd-status');
  if (statusDiv) {
    statusDiv.innerHTML = `
      <div class="row">
        <div>Skor: ${score}/${totalQuestions}</div>
        <span class="space"></span>
        <button class="btn outline" id="btnCheckAnswers">Periksa</button>
        <button class="btn" id="btnResetDnD">Reset</button>
      </div>
    `;
    
    document.getElementById('btnCheckAnswers')?.addEventListener('click', checkAnswers);
    document.getElementById('btnResetDnD')?.addEventListener('click', resetQuiz);
  }
}

function resetQuiz() {
  matches = {};
  score = 0;
  quizItems = generateQuizItems(currentSet, totalQuestions);
  
  const container = document.querySelector('.dnd-quiz-container');
  if (container) {
    container.innerHTML = renderDragDropQuiz();
    attachDragDropHandlers();
  }
}

export const KanaDragDrop = {
  render(type = 'hiragana') {
    currentSet = type;
    quizItems = generateQuizItems(type, totalQuestions);
    
    return `
      <section class="card">
        <div class="row">
          <h3>Drag & Drop Quiz - ${type === 'hiragana' ? 'Hiragana' : 'Katakana'}</h3>
          <span class="space"></span>
          <button class="btn outline" id="btnSwitchKanaType">
            Ganti ke ${type === 'hiragana' ? 'Katakana' : 'Hiragana'}
          </button>
        </div>
        <p class="muted">Seret dan lepas untuk mencocokkan kana dengan romaji yang benar.</p>
        
        <div class="dnd-quiz-container" style="margin-top:1rem;">
          ${renderDragDropQuiz()}
        </div>
        
        <div class="card" style="margin-top:1rem;">
          <h4>Cara Bermain</h4>
          <ul style="margin-top:.5rem; padding-left:1.2rem;">
            <li>Seret item dari satu kolom ke kolom lainnya</li>
            <li>Cocokkan kana dengan romaji yang benar</li>
            <li>Klik "Periksa" untuk melihat jawaban yang benar</li>
            <li>Item hijau = benar, merah = salah</li>
          </ul>
        </div>
      </section>
    `;
  },
  
  onMount() {
    attachDragDropHandlers();
    
    document.getElementById('btnSwitchKanaType')?.addEventListener('click', () => {
      currentSet = currentSet === 'hiragana' ? 'katakana' : 'hiragana';
      const container = document.querySelector('#app');
      if (container) {
        container.innerHTML = KanaDragDrop.render(currentSet);
        KanaDragDrop.onMount();
      }
    });
  }
};

// Add CSS for drag and drop
const style = document.createElement('style');
style.textContent = `
.dnd-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.dnd-column {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.dnd-column h4 {
  text-align: center;
  margin-bottom: 0.5rem;
}

.dnd-items {
  border: 2px dashed var(--border);
  border-radius: 0.5rem;
  padding: 0.5rem;
  min-height: 400px;
  background: var(--surface);
}

.dnd-item {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  cursor: move;
  text-align: center;
  transition: all 0.2s ease;
}

.dnd-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.dnd-item.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.dnd-item.potential-match {
  background: #fef3c7;
  border-color: #f59e0b;
}

.dnd-item.correct {
  background: #d1fae5;
  border-color: #10b981;
  pointer-events: none;
}

.dnd-item.incorrect {
  background: #fee2e2;
  border-color: #ef4444;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.dnd-status {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--surface);
  border-radius: 0.5rem;
}

@media (max-width: 768px) {
  .dnd-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .dnd-column {
    max-width: 100%;
  }
  
  .dnd-items {
    min-height: 250px;
  }
}
`;
document.head.appendChild(style);