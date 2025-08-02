/**
 * Bootstrap aplikasi
 * - Inisialisasi store, router, event global
 * - Toggle tema
 * - A11y: fokus ke #app saat route berubah
 */
import { initRouter, navigate, getCurrentRoute } from './router.js';
import { Store } from './store.js';
import { Pages } from './ui/pages.js';
import { Onboarding } from './ui/onboarding.js';

const appEl = document.getElementById('app');
const themeToggleBtn = document.getElementById('themeToggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  if (themeToggleBtn) {
    themeToggleBtn.textContent = theme === 'dark' ? '🌙' : '🌞';
    themeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
}

function handleThemeToggle() {
  const current = Store.getSettings().theme || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  Store.setSettings({ theme: next });
  applyTheme(next);
}

function render(route) {
  // Render halaman berbasis route
  const html = Pages.render(route);
  appEl.innerHTML = html;
  // Jalankan lifecycle onMount jika ada
  requestAnimationFrame(() => {
    Pages.onMount?.(route);
    // Fokus ke main untuk screen reader
    appEl.focus();
    // Tandai link aktif
    markActiveNav(route);
  });
}

function markActiveNav(route) {
  const links = document.querySelectorAll('nav a[data-link]');
  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    const path = href.replace('#', '');
    const isActive = route.path === '/' ? path === '/' : (path && route.path.startsWith(path));
    if (isActive) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

function bootstrap() {
  // Apply theme from settings
  applyTheme(Store.getSettings().theme || 'light');

  // Event toggle tema
  themeToggleBtn?.addEventListener('click', handleThemeToggle);

  // Mobile menu handlers
  const menuToggle = document.getElementById('menuToggle');
  const closeMobileNav = document.getElementById('closeMobileNav');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  
  menuToggle?.addEventListener('click', () => {
    mobileNav.classList.add('active');
    mobileNavOverlay.classList.add('active');
  });
  
  const closeMobileMenu = () => {
    mobileNav.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
  };
  
  closeMobileNav?.addEventListener('click', closeMobileMenu);
  mobileNavOverlay?.addEventListener('click', closeMobileMenu);
  
  // Close mobile menu on navigation
  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Init Router
  initRouter((route) => {
    render(route);
  });

  // Set default route if empty
  if (!location.hash || location.hash === '#' || location.hash === '') {
    location.hash = '#/';
  }

  // Navigasi awal
  render(getCurrentRoute());
  
  // Show onboarding for new users
  setTimeout(() => {
    Onboarding.show();
  }, 500);
}

bootstrap();

// Expose minimal navigate for internal links enhancement
window.__appNavigate = navigate;

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful:', registration);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed:', err);
      });
  });
}