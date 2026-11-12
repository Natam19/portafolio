/**
 * Cifras que cuentan desde cero cuando entran en pantalla
 * (elementos con data-count; data-dec = decimales, data-suffix = sufijo).
 * Usan coma decimal en español y punto en inglés.
 */
import { getLang } from './lang.js?v=2026111204';

function format(value, dec) {
  const s = value.toFixed(dec);
  return getLang() === 'en' ? s : s.replace('.', ',');
}

function render(node, value) {
  const dec = Number(node.dataset.dec || 0);
  node.textContent = format(value, dec) + (node.dataset.suffix || '');
}

export function initCounters() {
  const nodes = [...document.querySelectorAll('[data-count]')];
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const finish = (n) => { render(n, Number(n.dataset.count)); n.dataset.done = '1'; };
  if (reduce || !('IntersectionObserver' in window)) { nodes.forEach(finish); return; }

  const animate = (node) => {
    const target = Number(node.dataset.count);
    const t0 = performance.now();
    const dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      render(node, target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else node.dataset.done = '1';
    };
    requestAnimationFrame(tick);
  };

  nodes.forEach((n) => render(n, 0));
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  nodes.forEach((n) => io.observe(n));
}

/** Al cambiar de idioma, vuelve a escribir las cifras ya terminadas. */
export function refreshCounters() {
  document.querySelectorAll('[data-count][data-done]').forEach((n) => render(n, Number(n.dataset.count)));
}
