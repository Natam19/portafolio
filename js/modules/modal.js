/**
 * Modal reutilizable de detalle de proyecto.
 * Un único overlay que se rellena con los datos del proyecto seleccionado,
 * en lugar de renderizar un modal por proyecto.
 */
import { el, mount } from './dom.js?v=2026111208';
import { ui } from './lang.js?v=2026111208';

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

  // Montar dentro de .pg para heredar los design tokens y el tema (claro/oscuro),
  // que estan definidos en .pg y no en :root.
  (document.querySelector('.pg') || document.body).appendChild(overlay);
  return overlay;
}

/** Abre el modal con el proyecto indicado. */
export function openModal(project) {
  const { title, image, detail, url, repo } = project;
  const box = ensureOverlay();

  const card = el('div', { class: 'mod' }, [
    el('div', { class: 'mhead' }, [
      el('img', { class: 'mimg', src: image, alt: title }),
      el('button', { class: 'mclose', 'aria-label': ui('close'), onClick: closeModal, text: '✕' }),
    ]),
    el('div', { class: 'mbody' }, [
      el('p', { class: 'mrole', text: detail.role }),
      el('h3', { class: 'mt', text: title }),
      el('p', { class: 'mp', text: detail.intro }),
      el('h4', { class: 'mh4', text: ui('built') }),
      el('ul', { class: 'mlist' }, detail.points.map((p) =>
        el('li', { class: 'mli' }, [el('span', { class: 'dt', text: '→' }), p])
      )),
      el('div', { class: 'tags mt16' }, detail.tags.map((t) =>
        el('span', { class: 'tag', text: t })
      )),
      (url || repo) ? el('div', { class: 'mlinks' }, [
        url ? el('a', {
          class: 'mlive',
          href: url,
          target: '_blank',
          rel: 'noopener noreferrer',
        }, [ui('live')]) : null,
        repo ? el('a', {
          class: 'mlive mcode',
          href: repo,
          target: '_blank',
          rel: 'noopener noreferrer',
        }, [ui('code')]) : null,
      ]) : null,
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
