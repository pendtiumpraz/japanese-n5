/**
 * Speaking Practice with Recording
 * - Record user voice and compare with native pronunciation
 * - Waveform visualization
 * - Playback and self-assessment
 */
import { Audio } from '../audio.js';
import { Store } from '../store.js';
import { VocabN5 } from '../data/vocab_n5.js';
import { ReviewPage } from './review_page.js';

let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let currentPhrase = null;
let recordingBlob = null;
let audioContext = null;
let analyser = null;
let animationId = null;

const phrases = [
  { jp: 'こんにちは', romaji: 'konnichiwa', meaning: 'Hello', level: 'basic' },
  { jp: 'ありがとうございます', romaji: 'arigatou gozaimasu', meaning: 'Thank you', level: 'basic' },
  { jp: 'すみません', romaji: 'sumimasen', meaning: 'Excuse me', level: 'basic' },
  { jp: 'おはようございます', romaji: 'ohayou gozaimasu', meaning: 'Good morning', level: 'basic' },
  { jp: '私は学生です', romaji: 'watashi wa gakusei desu', meaning: 'I am a student', level: 'intermediate' },
  { jp: '日本語を勉強しています', romaji: 'nihongo wo benkyou shite imasu', meaning: 'I am studying Japanese', level: 'intermediate' },
  { jp: 'どこへ行きますか', romaji: 'doko e ikimasu ka', meaning: 'Where are you going?', level: 'intermediate' },
  { jp: 'これはいくらですか', romaji: 'kore wa ikura desu ka', meaning: 'How much is this?', level: 'intermediate' }
];

function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
  }
}

function drawWaveform(canvas) {
  if (!analyser) return;
  
  const canvasCtx = canvas.getContext('2d');
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  const draw = () => {
    animationId = requestAnimationFrame(draw);
    
    analyser.getByteFrequencyData(dataArray);
    
    canvasCtx.fillStyle = 'rgb(248, 250, 252)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] / 255) * canvas.height;
      
      const r = 37;
      const g = 99;
      const b = 235;
      
      canvasCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
  };
  
  draw();
}

function stopWaveform() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    // Initialize audio context for visualization
    initAudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    
    // Start waveform visualization
    const canvas = document.getElementById('waveformCanvas');
    if (canvas) {
      drawWaveform(canvas);
    }
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    
    mediaRecorder.onstop = () => {
      recordingBlob = new Blob(audioChunks, { type: 'audio/webm' });
      stopWaveform();
      
      // Clear waveform
      const canvas = document.getElementById('waveformCanvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgb(248, 250, 252)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
      
      updateRecordingUI();
    };
    
    mediaRecorder.start();
    isRecording = true;
    updateRecordingUI();
    
  } catch (err) {
    console.error('Error accessing microphone:', err);
    alert('マイクへのアクセスが拒否されました。ブラウザの設定を確認してください。');
  }
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;
  }
}

function playRecording() {
  if (recordingBlob) {
    const audio = new Audio(URL.createObjectURL(recordingBlob));
    audio.play();
  }
}

function updateRecordingUI() {
  const recordBtn = document.getElementById('btnRecord');
  const playBtn = document.getElementById('btnPlayRecording');
  const statusText = document.getElementById('recordingStatus');
  
  if (isRecording) {
    recordBtn.textContent = '⏹ 停止';
    recordBtn.classList.add('recording');
    statusText.textContent = '録音中...';
    playBtn.disabled = true;
  } else {
    recordBtn.textContent = '🎤 録音';
    recordBtn.classList.remove('recording');
    statusText.textContent = recordingBlob ? '録音完了' : '録音待機中';
    playBtn.disabled = !recordingBlob;
  }
}

function selectPhrase(phrase) {
  currentPhrase = phrase;
  recordingBlob = null;
  updatePhraseDisplay();
  updateRecordingUI();
}

function updatePhraseDisplay() {
  const display = document.getElementById('phraseDisplay');
  if (display && currentPhrase) {
    display.innerHTML = `
      <div class="flashcard" style="text-align:center;">
        <div class="jp" style="font-size:2em; margin-bottom:0.5rem;">${currentPhrase.jp}</div>
        <div class="romaji" style="font-size:1.2em;">${currentPhrase.romaji}</div>
        <div class="meaning">${currentPhrase.meaning}</div>
        <div class="actions" style="margin-top:1rem;">
          <button class="btn" data-speak="${currentPhrase.jp}">
            🔊 お手本を聞く
          </button>
        </div>
      </div>
    `;
  }
}

function renderPhraseSelector() {
  return `
    <div class="grid cols-2" style="margin-top:1rem;">
      ${phrases.map((phrase, idx) => `
        <div class="flashcard selectable" data-phrase-idx="${idx}">
          <div class="jp" style="font-size:1.5em;">${phrase.jp}</div>
          <div class="romaji">${phrase.romaji}</div>
          <div class="meaning muted">${phrase.meaning}</div>
          <div class="kbd" style="margin-top:0.5rem;">${phrase.level}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderRecordingInterface() {
  return `
    <div class="card" style="margin-top:1rem;">
      <h4>録音インターフェース</h4>
      <div id="phraseDisplay" style="margin:1rem 0;">
        <p class="muted">上からフレーズを選択してください</p>
      </div>
      
      <div class="recording-controls">
        <canvas id="waveformCanvas" width="400" height="100" style="width:100%; max-width:400px; height:100px; border:1px solid var(--border); border-radius:0.5rem; margin-bottom:1rem;"></canvas>
        
        <div class="row" style="gap:1rem; justify-content:center;">
          <button class="btn" id="btnRecord" disabled>🎤 録音</button>
          <button class="btn outline" id="btnPlayRecording" disabled>▶ 再生</button>
        </div>
        
        <div id="recordingStatus" style="text-align:center; margin-top:0.5rem;" class="muted">
          フレーズを選択して録音を開始
        </div>
      </div>
    </div>
  `;
}

function renderSelfAssessment() {
  if (!recordingBlob || !currentPhrase) return '';
  
  return `
    <div class="card" style="margin-top:1rem;">
      <h4>自己評価</h4>
      <p class="muted">録音を聞いて、発音を評価してください：</p>
      
      <div class="assessment-options" style="margin-top:1rem;">
        <div class="row" style="gap:0.5rem; justify-content:center;">
          <button class="btn outline assessment-btn" data-score="1">😅 練習必要</button>
          <button class="btn outline assessment-btn" data-score="2">🙂 まあまあ</button>
          <button class="btn outline assessment-btn" data-score="3">😊 良い</button>
          <button class="btn outline assessment-btn" data-score="4">🎉 完璧！</button>
        </div>
      </div>
      
      <div id="assessmentFeedback" style="margin-top:1rem;"></div>
    </div>
  `;
}

export const SpeakingRecorder = {
  render() {
    return `
      <section class="grid">
        <div class="card">
          <h3>Speaking Practice - 録音練習</h3>
          <p class="muted">フレーズを選んで録音し、発音を練習しましょう。</p>
        </div>
        
        <div class="card">
          <h4>フレーズを選択</h4>
          ${renderPhraseSelector()}
        </div>
        
        ${renderRecordingInterface()}
        
        <div id="assessmentContainer"></div>
        
        <div class="card">
          <h4>発音のコツ</h4>
          <ul style="margin-top:0.5rem; padding-left:1.2rem;">
            <li>まず、お手本を何度か聞いてください</li>
            <li>リズムとイントネーションに注意</li>
            <li>口を大きく開けて、はっきりと発音</li>
            <li>録音を聞いて、お手本と比較</li>
            <li>何度も練習して改善しましょう</li>
          </ul>
        </div>
      </section>
    `;
  },
  
  onMount() {
    // Phrase selection
    document.querySelectorAll('.flashcard.selectable').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.phraseIdx);
        const phrase = phrases[idx];
        if (phrase) {
          // Remove previous selection
          document.querySelectorAll('.flashcard.selectable').forEach(c => 
            c.classList.remove('selected')
          );
          card.classList.add('selected');
          
          selectPhrase(phrase);
          document.getElementById('btnRecord').disabled = false;
        }
      });
    });
    
    // Recording controls
    const recordBtn = document.getElementById('btnRecord');
    recordBtn?.addEventListener('click', () => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    });
    
    document.getElementById('btnPlayRecording')?.addEventListener('click', playRecording);
    
    // Handle speak buttons
    document.querySelectorAll('[data-speak]').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-speak');
        if (text) Audio.speak(text);
      });
    });
  },
  
  attachAssessmentHandlers() {
    document.querySelectorAll('.assessment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const score = parseInt(btn.dataset.score);
        const feedback = document.getElementById('assessmentFeedback');
        
        // Visual feedback
        document.querySelectorAll('.assessment-btn').forEach(b => 
          b.classList.remove('selected')
        );
        btn.classList.add('selected');
        
        // Text feedback
        const messages = {
          1: '練習を続けましょう！毎日少しずつ上達します。',
          2: 'いい感じです！もう少し練習すれば完璧になります。',
          3: 'とても良いです！ネイティブに近い発音です。',
          4: '素晴らしい！完璧な発音です！'
        };
        
        feedback.innerHTML = `
          <div class="flashcard" style="text-align:center;">
            <div style="font-size:2em;">${btn.textContent.split(' ')[0]}</div>
            <p>${messages[score]}</p>
          </div>
        `;
        
        // Track progress
        if (score >= 3) {
          // Consider it studied if good or perfect
          ReviewPage.recordVocabStudied(1);
        }
      });
    });
  }
};

// Add CSS for recording interface
const style = document.createElement('style');
style.textContent = `
.flashcard.selectable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.flashcard.selectable:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.flashcard.selected {
  border-color: var(--primary);
  background: #eff6ff;
}

.recording-controls {
  text-align: center;
  padding: 1rem;
}

.btn.recording {
  background: #ef4444;
  animation: pulse 1.5s infinite;
}

.btn.recording:hover {
  background: #dc2626;
}

.assessment-btn.selected {
  background: var(--primary);
  color: white;
}

#waveformCanvas {
  background: var(--surface);
}

@media (max-width: 768px) {
  .assessment-options .row {
    flex-wrap: wrap;
  }
  
  .assessment-btn {
    flex: 1 1 45%;
    min-width: 120px;
  }
}
`;
document.head.appendChild(style);