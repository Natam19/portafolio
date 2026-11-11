/**
 * Punto de entrada. Inicializa idioma y tema, renderiza las secciones
 * alimentadas por datos y arranca las animaciones cuando el DOM está listo.
 */
import { initTheme, setAccent } from './modules/theme.js?v=2026111102';
import {
  renderSkills,
  renderProjects,
  renderExperience,
  renderFormation,
} from './modules/sections.js?v=2026111102';
import { initReveal } from './modules/reveal.js?v=2026111102';
import { initLang, onLangChange } from './modules/lang.js?v=2026111102';
import { initNet } from './modules/net.js?v=2026111102';
import { initCounters, refreshCounters } from './modules/counters.js?v=2026111102';
import { initDemo } from './modules/demo.js?v=2026111102';
import { initGame } from './modules/game.js?v=2026111102';

function renderData() {
  renderProjects(document.getElementById('projects-grid'));
  renderExperience(document.getElementById('experience-list'));
  renderFormation(
    document.getElementById('education-list'),
    document.getElementById('certifications-list'),
  );
}

function init() {
  const page = document.getElementById('top');

  // Idioma primero: el resto se pinta ya en el idioma elegido.
  initLang();

  // Apariencia.
  setAccent('#7C3AED');
  initTheme(page, document.getElementById('theme-toggle'));

  // Contenido dinámico.
  renderSkills(document.getElementById('skills-marquee'));
  renderData();

  // Año dinámico en el pie.
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Movimiento (todo respeta prefers-reduced-motion).
  initReveal();
  initNet(document.getElementById('hero-net'));
  initCounters();
  initDemo();
  initGame(document.getElementById('game'));

  // Al cambiar de idioma se vuelve a pintar lo que viene de datos.
  onLangChange(() => {
    renderData();
    refreshCounters();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
