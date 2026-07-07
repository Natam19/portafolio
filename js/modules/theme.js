/**
 * Tema (claro / oscuro) y color de acento.
 *
 * - El tema se alterna con la clase .dark sobre el contenedor .pg y se
 *   recuerda en localStorage.
 * - El color de acento se inyecta como variable CSS (--ac) en :root, igual
 *   que hacía el componente original.
 */

const STORAGE_KEY = 'nm-portfolio-theme';
const DEFAULT_ACCENT = '#315BFF';

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
    toggleBtn.setAttribute('aria-label', dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
  }
}
