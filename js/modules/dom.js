/**
 * Utilidades mínimas de DOM para construir la interfaz desde datos.
 * Se usa textContent (no innerHTML) para evitar inyección de HTML.
 */

/**
 * Crea un elemento.
 * @param {string} tag           Etiqueta HTML.
 * @param {object} [attrs]       Atributos: { class, href, src, alt, dataset, onClick, text, ... }.
 * @param {Array}  [children]    Hijos (nodos o strings).
 * @returns {HTMLElement}
 */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value == null) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'html') node.innerHTML = value;
    else if (key === 'onClick') node.addEventListener('click', value);
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else node.setAttribute(key, value);
  }

  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

/** Reemplaza el contenido de un contenedor por los nodos dados. */
export function mount(target, nodes) {
  target.replaceChildren(...[].concat(nodes));
}
