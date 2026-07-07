/**
 * Modal reutilizable de detalle de proyecto.
 * Un único overlay que se rellena con los datos del proyecto seleccionado,
 * en lugar de renderizar un modal por proyecto.
 */
import { el, mount } from './dom.js';

let overlay;

/** Crea (una sola vez) el contenedor del modal y lo añade al body. */
function ensureOverlay() {
  if (overlay) return overlay;
  overlay = el('div', { class: 'ovl', role: 'dialog', 'aria-modal': 'true' });
  overlay.hidden = true;

  // Cerrar al hacer clic fuera de la tarjeta.
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  // Cerrar con Escape.
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  document.body.appendChild(overlay);
  return overlay;
}

/** Abre el modal con el proyecto indicado. */
export function openModal(project) {
  const { title, image, detail } = project;
  const box = ensureOverlay();

  const card = el('div', { class: 'mod' }, [
    el('div', { class: 'mhead' }, [
      el('img', { class: 'mimg', src: image, alt: title }),
      el('button', { class: 'mclose', 'aria-label': 'Cerrar', onClick: closeModal, text: '✕' }),
    ]),
    el('div', { class: 'mbody' }, [
      el('p', { class: 'mrole', text: detail.role }),
      el('h3', { class: 'mt', text: title }),
      el('p', { class: 'mp', text: detail.intro }),
      el('h4', { class: 'mh4', text: 'Qué construí' }),
      el('ul', { class: 'mlist' }, detail.points.map((p) =>
        el('li', { class: 'mli' }, [el('span', { class: 'dt', text: '→' }), p])
      )),
      el('div', { class: 'tags mt16' }, detail.tags.map((t) =>
        el('span', { class: 'tag', text: t })
      )),
    ]),
  ]);

  mount(box, card);
  box.hidden = false;
  document.body.style.overflow = 'hidden';
}

/** Cierra el modal. */
export function closeModal() {
  if (!overlay || overlay.hidden) return;
  overlay.hidden = true;
  overlay.replaceChildren();
  document.body.style.overflow = '';
}
