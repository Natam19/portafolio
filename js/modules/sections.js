/**
 * Render de las secciones alimentadas por datos: marquesina de skills,
 * rejilla de proyectos, experiencia y formación.
 */
import { el, mount } from './dom.js?v=2026111208';
import { openModal } from './modal.js?v=2026111208';
import { projects } from '../data/projects.js?v=2026111208';
import { skills, experience, education, certifications } from '../data/site.js?v=2026111208';
import { projectsEn, experienceEn, educationEn, certificationsEn } from '../data/en.js?v=2026111208';
import { localize, ui } from './lang.js?v=2026111208';

/** Proyecto en el idioma actual. */
export const projectFor = (p) => localize(p, projectsEn[p.id]);

/** Marquesina de tecnologías (duplicada para el bucle infinito). */
export function renderSkills(target) {
  const line = skills.join(' · ') + ' ·';
  const strip = () => el('span', { class: 'mqc', text: line });
  mount(target, el('div', { class: 'mqi' }, [strip(), strip()]));
}

/** Tarjetas de proyecto; al hacer clic abren el modal de detalle. */
export function renderProjects(target) {
  const list = projects.map(projectFor);
  const cards = list.map((p) =>
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
        el('span', { class: 'more', text: ui('seeProject') }),
      ]),
    ])
  );

  // Accesibilidad: abrir con Enter / Espacio.
  cards.forEach((card, i) => {
    card.querySelector('.pinf').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(list[i]);
      }
    });
  });

  mount(target, cards);
}

/** Filas de experiencia. */
export function renderExperience(target) {
  const rows = experience.map((base, i) => localize(base, experienceEn[i])).map((x) =>
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
  mount(eduTarget, education.map((b, i) => eduRow(localize(b, educationEn[i]))));
  mount(certTarget, certifications.map((b, i) => eduRow(localize(b, certificationsEn[i]))));
}
