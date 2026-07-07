/**
 * Punto de entrada. Inicializa el tema y renderiza las secciones
 * alimentadas por datos cuando el DOM está listo.
 */
import { initTheme, setAccent } from './modules/theme.js';
import {
  renderSkills,
  renderProjects,
  renderExperience,
  renderFormation,
} from './modules/sections.js';

function init() {
  const page = document.getElementById('top');

  // Apariencia.
  setAccent('#315BFF');
  initTheme(page, document.getElementById('theme-toggle'));

  // Contenido dinámico.
  renderSkills(document.getElementById('skills-marquee'));
  renderProjects(document.getElementById('projects-grid'));
  renderExperience(document.getElementById('experience-list'));
  renderFormation(
    document.getElementById('education-list'),
    document.getElementById('certifications-list'),
  );

  // Año dinámico en el pie.
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
