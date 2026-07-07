# Portafolio — Natalia Moncaleano

Portafolio personal de **Natalia Moncaleano Montero**, desarrolladora de software
(Front-End & UX · Inteligencia Artificial · Ciberseguridad) — Bogotá, Colombia.

Sitio estático, sin dependencias ni paso de build. El contenido está separado de
la presentación y de la lógica para que sea fácil de mantener y escalar: añadir un
proyecto es agregar un objeto a un archivo de datos.

## Estructura

```
portfolio/
├── index.html              # Estructura semántica de la página
├── css/
│   ├── fonts.css           # @font-face (Archivo · Instrument Serif)
│   ├── base.css            # Reset, tokens de diseño y temas (claro/oscuro)
│   ├── layout.css          # Contenedor, cabecera, secciones, responsive
│   ├── components.css      # Botones, chips, tarjetas, tags, marquesina
│   └── modal.css           # Modal de detalle de proyecto
├── js/
│   ├── main.js             # Punto de entrada
│   ├── data/
│   │   ├── projects.js     # Datos de los proyectos (tarjetas + modales)
│   │   └── site.js         # Perfil, skills, experiencia y formación
│   └── modules/
│       ├── dom.js          # Helper para construir el DOM desde datos
│       ├── theme.js        # Tema claro/oscuro + color de acento
│       ├── modal.js        # Modal reutilizable
│       └── sections.js     # Render de las secciones dinámicas
└── assets/
    ├── images/             # Portadas de proyectos y hero
    └── fonts/              # Tipografías self-hosted (.woff2)
```

## Cómo editar el contenido

- **Añadir o editar un proyecto** → `js/data/projects.js`. Cada objeto genera
  automáticamente su tarjeta en la rejilla y su modal de detalle.
- **Skills, experiencia y formación** → `js/data/site.js`.
- **Estilos** → los archivos en `css/`. Los colores y el tema se controlan con
  variables CSS definidas en `css/base.css`.

## Cómo ejecutar en local

El sitio usa módulos ES, así que debe servirse por HTTP (no abrir con `file://`).
Con Python:

```bash
cd portfolio
python -m http.server 8000
# abrir http://localhost:8000
```

## Despliegue en GitHub Pages

1. Sube el repositorio a GitHub.
2. En **Settings → Pages**, elige la rama `main` y la carpeta raíz (`/`).
3. El sitio quedará publicado en la URL que indique GitHub Pages.

El archivo `.nojekyll` evita que GitHub procese el sitio con Jekyll.

---

© Natalia Moncaleano Montero
