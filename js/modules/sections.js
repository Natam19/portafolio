/**
 * Render de las secciones alimentadas por datos: marquesina de skills,
 * rejilla de proyectos, experiencia y formación.
 */
import { el, mount } from './dom.js';
import { openModal } from './modal.js';
import { projects } from '../data/projects.js';
import { skills, experience, education, certifications } from '../data/site.js';

/** Marquesina de tecnologías (duplicada para el bucle infinito). */
export function renderSkills(target) {
  const line = skills.join(' · ') + ' ·';
  const strip = () => el('span', { class: 'mqc', text: line });
  mount(target, el('div', { class: 'mqi' }, [strip(), strip()]));
}

/** Tarjetas de proyecto; al hacer clic abren el modal de detalle. */
export function renderProjects(target) {
  const cards = projects.map((p) =>
    el('article', { class: `pcard ${p.span}` }, [
      el('div', { class: 'shot' }, [
        el('img', { class: 'cimg', src: p.image, alt: p.title }),
      ]),
      el('div', {
        class: 'pinf',
        role: 'button',
        tabindex: '0',
        onClick: () => openModal(p),
      }, [
        el('div', { class: 'prow' }, [
          el('span', { class: 'pt', text: p.title }),
          el('span', { class: 'py', text: p.year }),
        ]),
        el('p', { class: 'pd', text: p.summary }),
        el('div', { class: 'tags' }, p.tags.map((t) => el('span', { class: 'tag', text: t }))),
        el('span', { class: 'more', text: 'Ver proyecto →' }),
      ]),
    ])
  );

  // Accesibilidad: abrir con Enter / Espacio.
  cards.forEach((card, i) => {
    card.querySelector('.pinf').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(projects[i]);
      }
    });
  });

  mount(target, cards);
}

/** Filas de experiencia. */
export function renderExperience(target) {
  const rows = experience.map((x) =>
    el('div', { class: 'xrow' }, [
      el('div', {}, [
        el('div', { class: 'xr', text: x.role }),
        el('div', { class: 'xc', text: x.org }),
      ]),
      el('p', { class: 'xd', text: x.description }),
      el('div', { class: 'xmeta' }, [x.period, el('br'), x.place]),
    ])
  );
  mount(target, rows);
}

/** Una fila de formación (educación o certificación). */
function eduRow(item) {
  const label = el('span', {}, [
    el('span', { class: 'fw6', text: item.name }),
    item.org ? el('span', { class: 'ei', text: ` — ${item.org}` }) : null,
  ]);
  return el('div', { class: 'erow' }, [
    label,
    item.year ? el('span', { class: 'ey', text: item.year }) : null,
  ]);
}

/** Columnas de formación: educación + certificaciones e idiomas. */
export function renderFormation(eduTarget, certTarget) {
  mount(eduTarget, education.map(eduRow));
  mount(certTarget, certifications.map(eduRow));
}
