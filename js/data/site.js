/**
 * Datos generales del sitio: perfil, skills, experiencia y formación.
 * Centralizar el contenido aquí permite actualizar el portafolio sin tocar
 * la lógica de render ni el marcado.
 */

export const profile = {
  name: 'Natalia Moncaleano',
  fullName: 'Natalia Moncaleano Montero',
  email: 'nattymoncaleanomontero@gmail.com',
  phone: '+57 305 384 3369',
  phoneHref: '+573053843369',
  location: 'Bogotá, Colombia',
  year: '2026',
};

/** Tecnologías que recorren la marquesina del hero. */
export const skills = [
  'Python', 'SQL', 'Java', 'React', 'FastAPI', 'PostgreSQL / PostGIS',
  'WordPress', 'SEO', 'UX / UI', 'Arquitectura de la información',
  'Inteligencia Artificial', 'Ciberseguridad', 'n8n', 'Apache Spark',
  'AWS', 'Docker', 'Power BI', 'Scikit-learn',
];

/** Experiencia profesional (orden cronológico inverso). */
export const experience = [
  {
    role: 'Desarrolladora Web',
    org: 'EH2 Ingeniería',
    description: 'Soluciones web escalables y de alto rendimiento para el mercado español: arquitectura de la información, navegación centrada en UX, SEO y WordPress orientados a conversión.',
    period: 'Dic 2025 — Actualidad',
    place: 'Málaga, España · remoto',
  },
  {
    role: 'Monitora Académica — IA y Ciberseguridad',
    org: 'MinTIC',
    description: 'Acompañamiento a estudiantes en Inteligencia Artificial y Ciberseguridad: conceptos técnicos, habilidades digitales y aplicación práctica del conocimiento.',
    period: 'Oct 2025',
    place: 'Colombia',
  },
  {
    role: 'Monitora Académica — Seguridad Informática',
    org: 'MinTIC',
    description: 'Formación en amenazas digitales, buenas prácticas y protección de datos, fortaleciendo la cultura de seguridad informática en el ámbito académico.',
    period: 'Ago 2025',
    place: 'Colombia',
  },
];

/** Formación: educación formal. */
export const education = [
  { name: 'Pregrado en Ingeniería de Sistemas', org: 'Universidad de San Buenaventura', year: '2022 — Hoy' },
  { name: 'Diplomado en Gerencia de Proyectos', org: 'Politécnico de Colombia', year: '2025' },
  { name: 'Técnico en Diseño e Integración de Multimedia', org: 'Instituto Técnico Distrital Julio Flórez', year: '2019 — 2020' },
];

/** Formación: certificaciones e idiomas. */
export const certifications = [
  { name: 'Calidad del software en el proceso de desarrollo', org: 'SENA', year: '2024' },
  { name: 'Analítica de datos para procesos logísticos', org: 'SENA', year: '2024' },
  { name: 'Curso de inglés', org: 'Smart Academia de Idiomas', year: '2025 — Hoy' },
  { name: 'Idiomas', org: 'Español nativo · Inglés A2, en formación', year: '' },
];
