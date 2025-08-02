/**
 * Review & Progress Dashboard Page
 * - Track learning progress across all modules
 * - Comprehensive review quizzes
 * - Statistics and achievements
 * - Study streaks and goals
 */
import { Store } from '../store.js';
import { KanaData } from '../data/kana.js';
import { KanjiN5 } from '../data/kanji_n5.js';
import { VocabN5 } from '../data/vocab_n5.js';
import { Quiz } from '../quiz.js';
import { Audio } from '../audio.js';

// Progress tracking keys
const PROGRESS_KEYS = {
  kanaStudied: 'progress_kana_studied',
  kanjiStudied: 'progress_kanji_studied',
  vocabStudied: 'progress_vocab_studied',
  quizzesTaken: 'progress_quizzes_taken',
  totalScore: 'progress_total_score',
  studyStreak: 'progress_study_streak',
  lastStudyDate: 'progress_last_study_date',
  achievements: 'progress_achievements'
};

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'first_quiz', name: 'Pemula', desc: 'Selesaikan kuis pertama', icon: '🎯' },
  { id: 'kana_master', name: 'Master Kana', desc: 'Pelajari semua Hiragana & Katakana', icon: '🎌' },
  { id: 'kanji_10', name: 'Kanji Pemula', desc: 'Pelajari 10 Kanji', icon: '📝' },
  { id: 'vocab_50', name: 'Kosakata Dasar', desc: 'Pelajari 50 kosakata', icon: '📚' },
  { id: 'streak_7', name: 'Konsisten', desc: 'Belajar 7 hari berturut-turut', icon: '🔥' },
  { id: 'perfect_quiz', name: 'Sempurna', desc: 'Dapatkan skor 100% dalam kuis', icon: '⭐' },
  { id: 'review_champion', name: 'Juara Review', desc: 'Selesaikan 10 review komprehensif', icon: '🏆' }
];

function getProgress() {
  const progress = {};
  Object.keys(PROGRESS_KEYS).forEach(key => {
    const stored = localStorage.getItem(PROGRESS_KEYS[key]);
    if (key === 'achievements') {
      progress[key] = stored ? JSON.parse(stored) : [];
    } else if (key === 'lastStudyDate') {
      progress[key] = stored || null;
    } else {
      progress[key] = parseInt(stored || '0', 10);
    }
  });
  return progress;
}

function updateProgress(updates) {
  Object.entries(updates).forEach(([key, value]) => {
    if (PROGRESS_KEYS[key]) {
      if (key === 'achievements') {
        localStorage.setItem(PROGRESS_KEYS[key], JSON.stringify(value));
      } else {
        localStorage.setItem(PROGRESS_KEYS[key], value.toString());
      }
    }
  });
}

function checkAchievements(progress) {
  const newAchievements = [];
  const current = progress.achievements || [];
  
  ACHIEVEMENTS.forEach(achievement => {
    if (current.includes(achievement.id)) return;
    
    let earned = false;
    switch (achievement.id) {
      case 'first_quiz':
        earned = progress.quizzesTaken > 0;
        break;
      case 'kana_master':
        earned = progress.kanaStudied >= 92; // 46 hiragana + 46 katakana
        break;
      case 'kanji_10':
        earned = progress.kanjiStudied >= 10;
        break;
      case 'vocab_50':
        earned = progress.vocabStudied >= 50;
        break;
      case 'streak_7':
        earned = progress.studyStreak >= 7;
        break;
      case 'perfect_quiz':
        // Check in real-time during quiz
        break;
      case 'review_champion':
        // Track comprehensive reviews separately
        break;
    }
    
    if (earned) {
      newAchievements.push(achievement);
      current.push(achievement.id);
    }
  });
  
  if (newAchievements.length > 0) {
    updateProgress({ achievements: current });
  }
  
  return newAchievements;
}

function updateStudyStreak() {
  const progress = getProgress();
  const today = new Date().toDateString();
  const lastDate = progress.lastStudyDate;
  
  if (lastDate === today) {
    return; // Already studied today
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  
  let newStreak = 1;
  if (lastDate === yesterdayStr) {
    newStreak = progress.studyStreak + 1;
  }
  
  updateProgress({
    studyStreak: newStreak,
    lastStudyDate: today
  });
  
  return newStreak;
}

function renderProgressCards(progress) {
  const kanaTotal = 92; // 46 hiragana + 46 katakana basic
  const kanjiTotal = KanjiN5.length;
  const vocabTotal = VocabN5.length;
  
  const kanaPercent = Math.round((progress.kanaStudied / kanaTotal) * 100);
  const kanjiPercent = Math.round((progress.kanjiStudied / kanjiTotal) * 100);
  const vocabPercent = Math.round((progress.vocabStudied / vocabTotal) * 100);
  
  return `
    <div class="grid cols-3" style="margin-top:1rem;">
      <div class="card">
        <h4>Kana</h4>
        <div class="progress-bar" style="margin-top:.5rem;">
          <div class="progress-fill" style="width:${kanaPercent}%"></div>
        </div>
        <div class="muted" style="margin-top:.25rem;">
          ${progress.kanaStudied}/${kanaTotal} (${kanaPercent}%)
        </div>
      </div>
      
      <div class="card">
        <h4>Kanji</h4>
        <div class="progress-bar" style="margin-top:.5rem;">
          <div class="progress-fill" style="width:${kanjiPercent}%"></div>
        </div>
        <div class="muted" style="margin-top:.25rem;">
          ${progress.kanjiStudied}/${kanjiTotal} (${kanjiPercent}%)
        </div>
      </div>
      
      <div class="card">
        <h4>Kosakata</h4>
        <div class="progress-bar" style="margin-top:.5rem;">
          <div class="progress-fill" style="width:${vocabPercent}%"></div>
        </div>
        <div class="muted" style="margin-top:.25rem;">
          ${progress.vocabStudied}/${vocabTotal} (${vocabPercent}%)
        </div>
      </div>
    </div>
  `;
}

function renderStats(progress) {
  const avgScore = progress.quizzesTaken > 0 
    ? Math.round(progress.totalScore / progress.quizzesTaken) 
    : 0;
    
  return `
    <div class="grid cols-2" style="margin-top:1rem;">
      <div class="flashcard">
        <div class="romaji">Total Kuis</div>
        <div class="jp" style="font-size:2em;">${progress.quizzesTaken}</div>
      </div>
      <div class="flashcard">
        <div class="romaji">Rata-rata Skor</div>
        <div class="jp" style="font-size:2em;">${avgScore}%</div>
      </div>
      <div class="flashcard">
        <div class="romaji">Study Streak</div>
        <div class="jp" style="font-size:2em;">${progress.studyStreak} 🔥</div>
      </div>
      <div class="flashcard">
        <div class="romaji">Achievement</div>
        <div class="jp" style="font-size:2em;">${progress.achievements.length}/${ACHIEVEMENTS.length}</div>
      </div>
    </div>
  `;
}

function renderAchievements(progress) {
  return `
    <div class="card">
      <h3>Achievements</h3>
      <div class="grid cols-2" style="margin-top:.75rem;">
        ${ACHIEVEMENTS.map(a => {
          const earned = progress.achievements.includes(a.id);
          return `
            <div class="flashcard ${earned ? '' : 'locked'}" 
                 style="${earned ? '' : 'opacity:0.5;'}">
              <div class="row">
                <span style="font-size:2em;">${a.icon}</span>
                <div style="flex:1; margin-left:.5rem;">
                  <div style="font-weight:600;">${a.name}</div>
                  <div class="muted" style="font-size:.85em;">${a.desc}</div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

let reviewQuizActive = false;
let reviewQuestions = [];
let reviewIndex = 0;
let reviewScore = 0;

function generateComprehensiveReview() {
  const questions = [];
  
  // Mix questions from all categories
  // 1. Kana questions (30%)
  const kanaPool = [...KanaData.hiragana, ...KanaData.katakana].slice(0, 20);
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * kanaPool.length);
    const kana = kanaPool[idx];
    questions.push({
      type: 'choice',
      prompt: `Romaji untuk "${kana.kana}" adalah:`,
      choices: generateKanaChoices(kanaPool, idx),
      correct: kana.romaji,
      kana: kana.kana
    });
  }
  
  // 2. Kanji questions (30%)
  const kanjiPool = KanjiN5.slice(0, 20);
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * kanjiPool.length);
    const kanji = kanjiPool[idx];
    questions.push({
      type: 'choice',
      prompt: `Arti dari kanji "${kanji.kanji}" adalah:`,
      choices: generateKanjiChoices(kanjiPool, idx),
      correct: kanji.meaning,
      kana: kanji.kanji
    });
  }
  
  // 3. Vocab questions (40%)
  const vocabPool = VocabN5.slice(0, 30);
  for (let i = 0; i < 4; i++) {
    const idx = Math.floor(Math.random() * vocabPool.length);
    const vocab = vocabPool[idx];
    if (Math.random() > 0.5) {
      questions.push({
        type: 'choice',
        prompt: `Kata Jepang untuk "${vocab.meaning}" adalah:`,
        choices: generateVocabChoices(vocabPool, idx, 'jp'),
        correct: vocab.jp,
        kana: vocab.jp
      });
    } else {
      questions.push({
        type: 'typing',
        prompt: `Ketik romaji untuk: ${vocab.jp} (${vocab.meaning})`,
        correct: vocab.romaji.toLowerCase(),
        kana: vocab.jp
      });
    }
  }
  
  // Shuffle questions
  return questions.sort(() => Math.random() - 0.5);
}

function generateKanaChoices(pool, correctIdx) {
  const choices = [pool[correctIdx].romaji];
  const used = new Set([correctIdx]);
  
  while (choices.length < 4 && used.size < pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    if (!used.has(idx)) {
      used.add(idx);
      choices.push(pool[idx].romaji);
    }
  }
  
  return choices.sort(() => Math.random() - 0.5);
}

function generateKanjiChoices(pool, correctIdx) {
  const choices = [pool[correctIdx].meaning];
  const used = new Set([correctIdx]);
  
  while (choices.length < 4 && used.size < pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    if (!used.has(idx)) {
      used.add(idx);
      choices.push(pool[idx].meaning);
    }
  }
  
  return choices.sort(() => Math.random() - 0.5);
}

function generateVocabChoices(pool, correctIdx, field) {
  const choices = [pool[correctIdx][field]];
  const used = new Set([correctIdx]);
  
  while (choices.length < 4 && used.size < pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    if (!used.has(idx)) {
      used.add(idx);
      choices.push(pool[idx][field]);
    }
  }
  
  return choices.sort(() => Math.random() - 0.5);
}

function renderReviewQuiz() {
  if (reviewIndex >= reviewQuestions.length) {
    // Quiz completed
    const percentage = Math.round((reviewScore / reviewQuestions.length) * 100);
    const progress = getProgress();
    
    // Update progress
    updateProgress({
      quizzesTaken: progress.quizzesTaken + 1,
      totalScore: progress.totalScore + percentage
    });
    
    // Check for perfect score achievement
    if (percentage === 100) {
      const achievements = progress.achievements || [];
      if (!achievements.includes('perfect_quiz')) {
        achievements.push('perfect_quiz');
        updateProgress({ achievements });
      }
    }
    
    return `
      <div class="card">
        <h3>Review Selesai!</h3>
        <div class="jp" style="font-size:3em; text-align:center; margin:1rem 0;">
          ${percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
        </div>
        <div class="row" style="margin-top:1rem;">
          <div>Skor: ${reviewScore}/${reviewQuestions.length} (${percentage}%)</div>
          <span class="space"></span>
          <button class="btn" id="btnRestartReview">Ulangi</button>
          <button class="btn outline" id="btnBackToDashboard">Dashboard</button>
        </div>
        ${percentage >= 80 ? '<p class="muted" style="margin-top:1rem;">Luar biasa! Terus pertahankan!</p>' : 
          '<p class="muted" style="margin-top:1rem;">Tetap semangat! Latihan membuat sempurna.</p>'}
      </div>
    `;
  }
  
  const q = reviewQuestions[reviewIndex];
  return `
    <div class="card">
      <div class="row">
        <h4>Review ${reviewIndex + 1}/${reviewQuestions.length}</h4>
        <span class="space"></span>
        <div class="muted">Skor: ${reviewScore}</div>
      </div>
      ${Quiz.renderQuestion(q, reviewIndex, reviewQuestions.length)}
    </div>
  `;
}

export const ReviewPage = {
  render() {
    const progress = getProgress();
    updateStudyStreak(); // Update streak when visiting
    
    if (reviewQuizActive) {
      return `
        <section class="grid">
          ${renderReviewQuiz()}
        </section>
      `;
    }
    
    return `
      <section class="grid">
        <div class="card">
          <div class="row">
            <h3>Review & Progress</h3>
            <span class="space"></span>
            <button class="btn" id="btnStartReview">
              📝 Mulai Review Komprehensif
            </button>
          </div>
          <p class="muted">Pantau progres belajar dan uji pemahaman menyeluruh.</p>
        </div>
        
        <div class="card">
          <h3>Progress Belajar</h3>
          ${renderProgressCards(progress)}
        </div>
        
        <div class="card">
          <h3>Statistik</h3>
          ${renderStats(progress)}
        </div>
        
        ${renderAchievements(progress)}
        
        <div class="card">
          <h3>Tips Review Efektif</h3>
          <ul style="margin-top:.5rem; padding-left:1.2rem;">
            <li>Review secara konsisten setiap hari untuk mempertahankan streak</li>
            <li>Fokus pada materi yang masih belum dikuasai</li>
            <li>Gunakan review komprehensif untuk menguji semua materi</li>
            <li>Catat kata atau kanji yang sering salah untuk dipelajari lagi</li>
          </ul>
        </div>
      </section>
    `;
  },
  
  onMount() {
    const progress = getProgress();
    
    // Check for new achievements
    const newAchievements = checkAchievements(progress);
    if (newAchievements.length > 0) {
      // Could show a notification here
      console.log('New achievements unlocked:', newAchievements);
    }
    
    if (reviewQuizActive) {
      ReviewPage.attachQuizHandlers();
    } else {
      // Start review button
      document.getElementById('btnStartReview')?.addEventListener('click', () => {
        reviewQuizActive = true;
        reviewQuestions = generateComprehensiveReview();
        reviewIndex = 0;
        reviewScore = 0;
        
        const content = document.querySelector('#app');
        if (content) {
          content.innerHTML = ReviewPage.render();
          ReviewPage.attachQuizHandlers();
        }
      });
    }
  },
  
  attachQuizHandlers() {
    const wrap = document.querySelector('#app');
    if (!wrap) return;
    
    // Handle quiz completion buttons
    document.getElementById('btnRestartReview')?.addEventListener('click', () => {
      reviewQuestions = generateComprehensiveReview();
      reviewIndex = 0;
      reviewScore = 0;
      wrap.innerHTML = ReviewPage.render();
      ReviewPage.attachQuizHandlers();
    });
    
    document.getElementById('btnBackToDashboard')?.addEventListener('click', () => {
      reviewQuizActive = false;
      wrap.innerHTML = ReviewPage.render();
      ReviewPage.onMount();
    });
    
    // Handle quiz question
    if (reviewIndex < reviewQuestions.length) {
      const q = reviewQuestions[reviewIndex];
      Quiz.attachHandlers(wrap, q, (isCorrect) => {
        if (isCorrect) reviewScore++;
        reviewIndex++;
        wrap.innerHTML = ReviewPage.render();
        ReviewPage.attachQuizHandlers();
      });
    }
  },
  
  // Export progress update functions for other modules to use
  recordKanaStudied(count) {
    const progress = getProgress();
    updateProgress({ kanaStudied: Math.min(92, progress.kanaStudied + count) });
  },
  
  recordKanjiStudied(count) {
    const progress = getProgress();
    updateProgress({ kanjiStudied: progress.kanjiStudied + count });
  },
  
  recordVocabStudied(count) {
    const progress = getProgress();
    updateProgress({ vocabStudied: progress.vocabStudied + count });
  }
};