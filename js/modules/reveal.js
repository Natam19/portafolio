/**
 * Aparición progresiva al hacer scroll. Marca con la clase .reveal a los
 * bloques de contenido y les añade .in cuando entran en viewport. Respeta la
 * preferencia de movimiento reducido del sistema.
 */

/** Selectores de los elementos que aparecen al entrar en pantalla. */
const TARGETS = [
  '.hero .lbl', '.hero .h1', '.hero .sub', '.hero .cta', '.hero .meta',
  '.shead', '.pcard', '.statg > *', '.xrow', '.fgrid > *',
  '#contacto .lbl', '#contacto .h1', '#contacto .cta', '.fbot',
];

export function initReveal() {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const nodes = document.querySelectorAll(TARGETS.join(','));

  if (reduce || !('IntersectionObserver' in window)) {
    nodes.forEach((n) => n.classList.add('reveal', 'in'));
    return;
  }

  nodes.forEach((n, i) => {
    n.classList.add('reveal');
    // Escalona en grupos para que las tarjetas hermanas entren en cascada.
    n.style.setProperty('--reveal-delay', `${(i % 6) * 60}ms`);
  });

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  nodes.forEach((n) => io.observe(n));
}
