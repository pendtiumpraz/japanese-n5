/**
 * Fixed Kanji N5 Page
 * - Properly loads stroke trainer for each kanji
 */
import { KanjiN5Complete as KanjiN5 } from '../data/kanji_n5_complete.js';
import { StrokeTrainer, createHiDPICanvas } from '../write.js';
import { Quiz } from '../quiz.js';

function renderList(items) {
  return `
    <div class="grid cols-3" style="margin-top:1rem; gap:1.5rem;">
      ${items.map((k, i) => `
        <div class="flashcard" data-kanji-idx="${i}" style="min-height:220px; padding:1.5rem;">
          <div style="text-align:center;">
            <div class="jp" style="font-size:3rem; margin-bottom:0.5rem;">${k.kanji}</div>
            <div class="romaji" style="font-size:0.875rem; margin-bottom:0.25rem;">
              ${(k.onyomi||[]).join('・')} ${k.kunyomi?.length? '｜'+k.kunyomi.join('・') : ''}
            </div>
            <div class="meaning" style="font-size:0.9375rem; color:var(--muted); margin-bottom:1rem;">
              ${k.meaning || ''}
            </div>
          </div>
          <div class="actions" style="display:flex; gap:0.5rem; justify-content:center;">
            <button class="btn small" data-action="practice" data-idx="${i}">Latihan Stroke</button>
            <button class="btn outline small" data-action="examples" data-idx="${i}">Contoh</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderPracticePanel() {
  return `
    <section class="card" id="kanjiPractice" style="margin-top:3rem;">
      <div class="row">
        <h3>Latihan Stroke</h3>
        <span class="space"></span>
        <button class="btn outline" id="btnResetKanjiStroke">Reset</button>
      </div>
      <div class="row" style="margin-top:1rem; gap:1.5rem; align-items:flex-start;">
        <div id="kanjiCanvasWrap" style="width:320px; height:320px; border:2px solid var(--border); border-radius:var(--radius);"></div>
        <div class="card" style="flex:1;">
          <div class="muted">Pilih Kanji dari daftar untuk memuat panduan stroke.</div>
          <div id="kanjiMeta" style="margin-top:1rem;"></div>
        </div>
      </div>
    </section>
  `;
}

function renderQuizPanel() {
  return `
    <section class="card" id="kanjiQuiz" style="margin-top:3rem;">
      <div class="row">
        <h3>Mini Kuis Kanji</h3>
        <span class="space"></span>
        <button class="btn" id="btnStartKanjiQuiz">Mulai</button>
      </div>
      <div id="kanjiQuizWrap" style="margin-top:1rem;"></div>
    </section>
  `;
}

export const KanjiPage = {
  render() {
    const items = KanjiN5;
    return `
      <section class="grid">
        <div class="card">
          <h3>Writing Kanji (N5)</h3>
          <p class="muted">${KanjiN5.length} Kanji JLPT N5 lengkap dengan contoh dan latihan stroke.</p>
        </div>
        ${renderList(items)}
        ${renderPracticePanel()}
        ${renderQuizPanel()}
      </section>
    `;
  },

  onMount() {
    console.log('KanjiPage onMount called');
    let currentTrainer = null;
    let currentKanji = null;

    function loadKanji(idx) {
      console.log('loadKanji called with idx:', idx);
      const k = KanjiN5[idx];
      if (!k) return;
      
      currentKanji = k;
      
      // Update meta info
      const meta = document.getElementById('kanjiMeta');
      if (meta) {
        const onyomi = (k.onyomi||[]).join('・');
        const kunyomi = (k.kunyomi||[]).join('・');
        const ex = (k.examples||[]).map(e => `<div class="muted">• ${e.jp} — ${e.romaji} — ${e.meaning}</div>`).join('');
        meta.innerHTML = `
          <div class="row"><div class="jp" style="font-size:48px;">${k.kanji}</div></div>
          <div>Onyomi: ${onyomi || '-'}</div>
          <div>Kunyomi: ${kunyomi || '-'}</div>
          <div>Arti: ${k.meaning || '-'}</div>
          <div style="margin-top:1rem;">Contoh:${ex ? ex : ' (tidak tersedia)'}</div>
        `;
      }
      
      // Load stroke trainer
      const wrap = document.getElementById('kanjiCanvasWrap');
      if (!wrap) return;
      
      // Clear previous trainer
      wrap.innerHTML = '';
      
      // Check if strokes function exists
      if (k.strokes && typeof k.strokes === 'function') {
        const strokeData = k.strokes(320, 320);
        currentTrainer = new StrokeTrainer({ 
          width: 320, 
          height: 320, 
          target: strokeData 
        });
        currentTrainer.mount(wrap);
      } else {
        // No stroke data available
        wrap.innerHTML = '<div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--muted);">Stroke data belum tersedia</div>';
      }
    }

    // Practice button handlers
    const practiceButtons = document.querySelectorAll('[data-action="practice"]');
    console.log('Found practice buttons:', practiceButtons.length);
    
    practiceButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Practice button clicked');
        const idx = parseInt(btn.getAttribute('data-idx') || '0', 10);
        console.log('Button idx:', idx);
        loadKanji(idx);
        
        // Scroll to practice section
        document.getElementById('kanjiPractice')?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Examples button handlers
    const exampleButtons = document.querySelectorAll('[data-action="examples"]');
    console.log('Found example buttons:', exampleButtons.length);
    
    exampleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Examples button clicked');
        const idx = parseInt(btn.getAttribute('data-idx') || '0', 10);
        const k = KanjiN5[idx];
        console.log('Kanji at idx:', idx, k);
        if (!k) {
          console.error('No kanji found at index:', idx);
          return;
        }
        const meta = document.getElementById('kanjiMeta');
        if (!meta) {
          console.error('kanjiMeta element not found');
          return;
        }
        const ex = (k.examples||[]).map(e => `<div class="muted">• ${e.jp} — ${e.romaji} — ${e.meaning}</div>`).join('');
        meta.innerHTML = `
          <div class="row"><div class="jp" style="font-size:48px;">${k.kanji}</div></div>
          <div style="margin-top:1rem;">Contoh:${ex ? ex : ' (tidak tersedia)'}</div>
        `;
        
        // Also scroll to practice section to see the examples
        document.getElementById('kanjiPractice')?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Reset button
    document.getElementById('btnResetKanjiStroke')?.addEventListener('click', () => {
      if (currentTrainer) {
        currentTrainer.reset();
      }
    });

    // Quiz
    document.getElementById('btnStartKanjiQuiz')?.addEventListener('click', () => {
      const quizWrap = document.getElementById('kanjiQuizWrap');
      if (!quizWrap) return;

      const questions = [];
      for (let i = 0; i < 10; i++) {
        const idx = Math.floor(Math.random() * KanjiN5.length);
        const k = KanjiN5[idx];
        if (!k) continue;
        
        // Create question
        const q = {
          type: 'choice',
          question: `Arti dari kanji ${k.kanji} adalah?`,
          answer: k.meaning,
          options: [k.meaning]
        };
        
        // Add wrong options
        while (q.options.length < 4) {
          const wrongIdx = Math.floor(Math.random() * KanjiN5.length);
          const wrong = KanjiN5[wrongIdx]?.meaning;
          if (wrong && !q.options.includes(wrong)) {
            q.options.push(wrong);
          }
        }
        
        // Shuffle options
        q.options.sort(() => Math.random() - 0.5);
        questions.push(q);
      }

      let qIdx = 0;
      let score = 0;

      const renderQuestion = () => {
        if (qIdx >= questions.length) {
          quizWrap.innerHTML = `
            <div class="card" style="text-align:center; padding:2rem;">
              <h3>Kuis Selesai!</h3>
              <p>Skor: ${score}/${questions.length}</p>
              <button class="btn" id="btnRestartQuiz" style="margin-top:1rem;">Ulangi</button>
            </div>
          `;
          document.getElementById('btnRestartQuiz')?.addEventListener('click', () => {
            document.getElementById('btnStartKanjiQuiz')?.click();
          });
          return;
        }

        const q = questions[qIdx];
        quizWrap.innerHTML = `
          <div class="card">
            <div style="margin-bottom:1rem;">
              <span class="muted">Pertanyaan ${qIdx + 1} dari ${questions.length}</span>
            </div>
            <h4>${q.question}</h4>
            <div class="grid cols-2" style="margin-top:1rem; gap:0.75rem;">
              ${q.options.map((opt, i) => `
                <button class="btn outline quiz-option" data-option="${opt}">
                  ${opt}
                </button>
              `).join('')}
            </div>
          </div>
        `;

        quizWrap.querySelectorAll('.quiz-option').forEach(btn => {
          btn.addEventListener('click', () => {
            const selected = btn.dataset.option;
            if (selected === q.answer) {
              btn.classList.remove('outline');
              btn.classList.add('success');
              score++;
            } else {
              btn.classList.add('error');
              // Show correct answer
              quizWrap.querySelectorAll('.quiz-option').forEach(b => {
                if (b.dataset.option === q.answer) {
                  b.classList.remove('outline');
                  b.classList.add('success');
                }
              });
            }
            
            setTimeout(() => {
              qIdx++;
              renderQuestion();
            }, 1000);
          });
        });
      };

      renderQuestion();
    });
  }
};