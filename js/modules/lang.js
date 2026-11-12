/**
 * Idioma (español / inglés).
 *
 * - El texto fijo vive en el HTML en español; la versión en inglés va en el
 *   atributo data-en de cada elemento. Al cambiar de idioma se intercambia el
 *   contenido (con una animación corta).
 * - El contenido que se pinta desde JS (proyectos, experiencia, formación)
 *   se combina con las traducciones de data/en.js mediante localize().
 * - La página arranca en el idioma del navegador: español si está en
 *   español, inglés en cualquier otro caso. El botón ES | EN lo cambia, y esa
 *   elección se recuerda solo durante la visita (sessionStorage); en la
 *   próxima visita vuelve a mandar el idioma del navegador.
 */
import { uiEs, uiEn } from '../data/en.js?v=2026111208';

const STORAGE_KEY = 'nm-portfolio-lang';
const listeners = [];
let current = 'es';

const META = {
  es: {
    title: 'Natalia Moncaleano — Portafolio',
    desc: 'Natalia Moncaleano — Estudiante de Ingeniería de Sistemas en Bogotá. Datos, inteligencia artificial y ciberseguridad. Disponible para prácticas.',
    theme: ['Cambiar a tema oscuro', 'Cambiar a tema claro'],
  },
  en: {
    title: 'Natalia Moncaleano — Portfolio',
    desc: 'Natalia Moncaleano — Systems Engineering student in Bogotá. Data, artificial intelligence and cybersecurity. Available for internships.',
    theme: ['Switch to dark theme', 'Switch to light theme'],
  },
};

export function getLang() { return current; }

/** Textos de interfaz armados en JS. */
export function ui(key) { return (current === 'en' ? uiEn : uiEs)[key]; }

/** Mezcla un objeto en español con su traducción (si el idioma es inglés). */
export function localize(base, en) {
  if (current !== 'en' || !en) return base;
  const out = { ...base };
  for (const [k, v] of Object.entries(en)) {
    out[k] = (v && typeof v === 'object' && !Array.isArray(v)) ? localize(base[k] || {}, v) : v;
  }
  return out;
}

/** Registra una función que se vuelve a ejecutar al cambiar de idioma. */
export function onLangChange(fn) { listeners.push(fn); }

function applyStatic(animate) {
  document.querySelectorAll('[data-en]').forEach((node) => {
    if (node.dataset.es === undefined) node.dataset.es = node.innerHTML;
    const next = current === 'en' ? node.dataset.en : node.dataset.es;
    if (node.innerHTML === next) return;
    node.innerHTML = next;
    if (animate) {
      node.classList.remove('lswap');
      void node.offsetWidth; // reinicia la animación
      node.classList.add('lswap');
    }
  });
  // Enlaces con versión en inglés (por ejemplo, la hoja de vida).
  document.querySelectorAll('[data-href-en]').forEach((a) => {
    if (a.dataset.hrefEs === undefined) a.dataset.hrefEs = a.getAttribute('href');
    a.setAttribute('href', current === 'en' ? a.dataset.hrefEn : a.dataset.hrefEs);
  });
  document.querySelectorAll('[data-aria-en]').forEach((el) => {
    if (el.dataset.ariaEs === undefined) el.dataset.ariaEs = el.getAttribute('aria-label') || '';
    el.setAttribute('aria-label', current === 'en' ? el.dataset.ariaEn : el.dataset.ariaEs);
  });
  document.documentElement.lang = current;
  const m = META[current];
  document.title = m.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', m.desc);
  const tt = document.getElementById('theme-toggle');
  if (tt) {
    const dark = document.getElementById('top')?.classList.contains('dark');
    tt.setAttribute('aria-label', m.theme[dark ? 1 : 0]);
  }
  document.querySelectorAll('.lang [data-lang]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === current));
  });
}

export function setLang(lang, animate = true) {
  current = lang === 'en' ? 'en' : 'es';
  try { sessionStorage.setItem(STORAGE_KEY, current); } catch (_) { /* modo privado */ }
  applyStatic(animate);
  listeners.forEach((fn) => fn(current));
}

export function initLang() {
  let saved = null;
  try {
    saved = sessionStorage.getItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY); // elección guardada por la versión anterior
  } catch (_) { /* modo privado */ }
  const browser = (navigator.languages?.[0] || navigator.language || 'es').toLowerCase();
  const browserEs = browser.startsWith('es');
  current = saved || (browserEs ? 'es' : 'en');
  applyStatic(false);

  document.querySelectorAll('.lang [data-lang]').forEach((b) => {
    b.addEventListener('click', () => { if (b.dataset.lang !== current) setLang(b.dataset.lang); });
  });
}
