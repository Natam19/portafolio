/**
 * Tema (claro / oscuro) y color de acento.
 *
 * - El tema se alterna con la clase .dark sobre el contenedor .pg y se
 *   recuerda en localStorage.
 * - El color de acento se inyecta como variable CSS (--ac) en :root, igual
 *   que hacía el componente original.
 */

const STORAGE_KEY = 'nm-portfolio-theme';
const DEFAULT_ACCENT = '#7C3AED';

/** Aplica el color de acento a toda la página. */
export function setAccent(color = DEFAULT_ACCENT) {
  document.documentElement.style.setProperty('--ac', color);
}

/** Inicializa el tema y engancha el botón de alternado. */
export function initTheme(pageEl, toggleBtn) {
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const dark = saved ? saved === 'dark' : prefersDark;

  apply(pageEl, toggleBtn, dark);

  toggleBtn?.addEventListener('click', () => {
    const next = !pageEl.classList.contains('dark');
    apply(pageEl, toggleBtn, next);
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'claro');
  });
}

function apply(pageEl, toggleBtn, dark) {
  pageEl.classList.toggle('dark', dark);
  if (toggleBtn) {
    toggleBtn.textContent = dark ? '☀' : '☾';
    const en = document.documentElement.lang === 'en';
    toggleBtn.setAttribute('aria-label', dark
      ? (en ? 'Switch to light theme' : 'Cambiar a tema claro')
      : (en ? 'Switch to dark theme' : 'Cambiar a tema oscuro'));
  }
}
