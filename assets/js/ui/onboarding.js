/**
 * Onboarding System
 * Simple tutorial for new users
 */
import { Store } from '../store.js';

const ONBOARDING_KEY = 'jp_n5_onboarding_completed';

export const Onboarding = {
  hasCompleted() {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  },
  
  complete() {
    localStorage.setItem(ONBOARDING_KEY, 'true');
  },
  
  reset() {
    localStorage.removeItem(ONBOARDING_KEY);
  },
  
  show() {
    if (this.hasCompleted()) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'onboarding-overlay';
    overlay.innerHTML = `
      <div class="onboarding-modal">
        <div class="onboarding-content">
          <h2 class="onboarding-title">Selamat Datang di JP N5! 🎌</h2>
          <p class="onboarding-subtitle">Mari mulai perjalanan belajar Bahasa Jepang Anda</p>
          
          <div class="onboarding-steps">
            <div class="onboarding-step">
              <div class="step-icon">✍️</div>
              <h3>1. Belajar Kana</h3>
              <p>Mulai dengan Hiragana dan Katakana, dasar menulis Jepang</p>
            </div>
            
            <div class="onboarding-step">
              <div class="step-icon">🈷</div>
              <h3>2. Pelajari Kanji</h3>
              <p>100 Kanji dasar N5 dengan latihan stroke order</p>
            </div>
            
            <div class="onboarding-step">
              <div class="step-icon">🗣️</div>
              <h3>3. Latihan Speaking</h3>
              <p>Praktik pengucapan dengan recording dan TTS</p>
            </div>
            
            <div class="onboarding-step">
              <div class="step-icon">📊</div>
              <h3>4. Track Progress</h3>
              <p>Pantau kemajuan belajar dengan sistem achievement</p>
            </div>
          </div>
          
          <div class="onboarding-tips">
            <h4>💡 Tips:</h4>
            <ul>
              <li>Belajar 15-30 menit setiap hari</li>
              <li>Gunakan fitur TTS untuk mendengar pengucapan</li>
              <li>Ulangi quiz untuk memperkuat ingatan</li>
              <li>Cek progress secara berkala</li>
            </ul>
          </div>
          
          <div class="onboarding-actions">
            <button class="btn large" id="btnStartLearning">
              🚀 Mulai Belajar!
            </button>
            <button class="btn outline" id="btnSkipOnboarding">
              Lewati Tutorial
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Animate in
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });
    
    // Event handlers
    document.getElementById('btnStartLearning')?.addEventListener('click', () => {
      this.complete();
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
      window.location.hash = '#/writing/kana';
    });
    
    document.getElementById('btnSkipOnboarding')?.addEventListener('click', () => {
      this.complete();
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    });
  }
};

// CSS for onboarding
const style = document.createElement('style');
style.textContent = `
.onboarding-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 1rem;
}

.onboarding-overlay.active {
  opacity: 1;
}

.onboarding-modal {
  background: white;
  border-radius: 1rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.onboarding-overlay.active .onboarding-modal {
  transform: scale(1);
}

.onboarding-content {
  padding: 2rem;
}

.onboarding-title {
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
}

.onboarding-subtitle {
  text-align: center;
  color: var(--muted);
  margin-bottom: 2rem;
}

.onboarding-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.onboarding-step {
  text-align: center;
  padding: 1rem;
  background: var(--surface);
  border-radius: 0.75rem;
  border: 1px solid var(--border);
}

.step-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.onboarding-step h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.onboarding-step p {
  font-size: 0.875rem;
  color: var(--muted);
}

.onboarding-tips {
  background: var(--primary-100);
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
}

.onboarding-tips h4 {
  margin-bottom: 0.5rem;
}

.onboarding-tips ul {
  margin: 0;
  padding-left: 1.5rem;
}

.onboarding-tips li {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.onboarding-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .onboarding-content {
    padding: 1.5rem;
  }
  
  .onboarding-title {
    font-size: 1.5rem;
  }
  
  .onboarding-steps {
    grid-template-columns: repeat(2, 1fr);
  }
}
`;
document.head.appendChild(style);