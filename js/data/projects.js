/**
 * Datos de los proyectos destacados.
 *
 * Cada proyecto se renderiza automáticamente como tarjeta (grid) y como modal
 * de detalle. Para añadir un proyecto nuevo basta con agregar un objeto a este
 * array — no hay que tocar el HTML ni el CSS.
 *
 * Campos:
 *   id        Identificador único (usado por el modal).
 *   title     Nombre del proyecto.
 *   year      Año (se muestra en la tarjeta).
 *   span      Ancho en la rejilla: 'sp2' (2/6) o 'sp3' (3/6).
 *   image     Ruta de la portada (relativa a index.html).
 *   summary   Descripción corta de la tarjeta.
 *   tags      Tecnologías mostradas en la tarjeta.
 *   detail    Contenido del modal:
 *               role     Rol · contexto · fecha.
 *               intro    Párrafo introductorio.
 *               points   Lista "Qué construí".
 *               tags     Stack completo.
 */
export const projects = [
  {
    id: 'pulso',
    title: 'Pulso',
    year: '2026',
    span: 'sp2',
    image: 'assets/images/pulso.png',
    summary: 'PWA de salud cardiovascular con dashboard de métricas, tendencias a 30 días y análisis por IA en streaming. Recetas y rutinas generadas con IA, sin cuenta ni datos personales.',
    tags: ['React', 'Recharts', 'Claude', 'Supabase'],
    detail: {
      role: 'Desarrolladora · Proyecto personal · 2026',
      intro: 'App web progresiva (PWA) de salud cardiovascular potenciada por IA: registra métricas, muestra tendencias y entrega análisis y recomendaciones personalizadas en tiempo real — sin crear cuenta y sin entregar datos personales.',
      points: [
        'Dashboard de métricas con gráficas de tendencia a 30 días (Recharts).',
        'Análisis personalizado por IA con respuesta en streaming.',
        'Generación de recetas y rutinas de ejercicio con IA (Claude + Imagen 3).',
        'Persistencia en Supabase con enfoque de privacidad por diseño: sin cuenta ni datos personales.',
      ],
      tags: ['React', 'PWA', 'Recharts', 'Claude', 'Imagen 3', 'Supabase'],
    },
  },
  {
    id: 'iso',
    title: 'ISO_SECURE',
    year: '2026',
    span: 'sp2',
    image: 'assets/images/iso-secure.png',
    summary: 'Plataforma SGSI conforme a ISO/IEC 27001:2022 — KPIs, incidentes, controles, riesgos y auditoría. Modelado de amenazas con PASTA + STRIDE sobre API REST en capas.',
    tags: ['React', 'FastAPI', 'PostgreSQL', 'JWT + RBAC'],
    detail: {
      role: 'Desarrolladora · Universidad de San Buenaventura · 2026',
      intro: 'Plataforma de gestión de seguridad de la información (SGSI) conforme a ISO/IEC 27001:2022: lleva el cumplimiento normativo a un panel operativo, medible y auditable.',
      points: [
        'Dashboard de KPIs, gestión de incidentes, controles ISO, evaluación de riesgos y auditoría.',
        'Backend en capas con API REST (FastAPI/Python) y frontend React + Vite.',
        'Autenticación JWT con control de acceso por roles (RBAC) sobre PostgreSQL/Supabase.',
        'Modelado de amenazas con PASTA + STRIDE: DFD, matriz de riesgo y mapeo OWASP/ISO.',
      ],
      tags: ['React + Vite', 'FastAPI', 'PostgreSQL', 'JWT + RBAC', 'ISO 27001'],
    },
  },
  {
    id: 'health',
    title: 'HealthAI Breast BDI',
    year: '2026',
    span: 'sp2',
    image: 'assets/images/healthai.png',
    summary: 'Predicción de riesgo de cáncer de mama con Big Data: ~6.7M de mamografías (BCSC) procesadas con Spark, dashboard epidemiológico y despliegue en AWS.',
    tags: ['Spark', 'Scikit-learn', 'AWS', 'Docker'],
    detail: {
      role: 'Desarrolladora · Universidad de San Buenaventura · 2026',
      intro: 'Sistema web de predicción de riesgo de cáncer de mama basado en Big Data: procesa millones de registros clínicos para estimar riesgo individual y visualizar patrones epidemiológicos.',
      points: [
        'Procesamiento del dataset BCSC (~6.7M de mamografías) con Apache Spark.',
        'Modelo de clasificación entrenado con Scikit-learn.',
        'Backend FastAPI integrado con frontend React + Vite.',
        'Dashboard epidemiológico en Power BI.',
        'Despliegue en AWS (S3, Kinesis Firehose, EC2) sobre Docker.',
      ],
      tags: ['Apache Spark', 'Scikit-learn', 'FastAPI', 'Power BI', 'AWS', 'Docker'],
    },
  },
  {
    id: 'agro',
    title: 'AgroPred',
    year: '2024',
    span: 'sp3',
    image: 'assets/images/agropred.png',
    summary: 'Algoritmos genéticos para predecir condiciones óptimas de siembra. Presentado en el NASA Space Apps Challenge.',
    tags: ['Front-End', 'Algoritmos genéticos', 'NASA Space Apps'],
    detail: {
      role: 'Desarrolladora Front-End · NASA Space Apps Challenge · Oct 2024',
      intro: 'Aplicación que usa algoritmos genéticos para predecir las condiciones óptimas de siembra en áreas específicas — tecnología al servicio de la agricultura y la sostenibilidad.',
      points: [
        'Desarrollo del front-end de la aplicación.',
        'Colaboración en la integración de los algoritmos genéticos de predicción.',
        'Proyecto presentado en el NASA Space Apps Challenge 2024.',
      ],
      tags: ['Front-End', 'Algoritmos genéticos', 'Sostenibilidad'],
    },
  },
  {
    id: 'geo',
    title: 'GeoPol',
    year: '2024',
    span: 'sp3',
    image: 'assets/images/geopol.png',
    summary: 'Liderazgo de un SIG para análisis geoespacial con impacto en políticas públicas. Ponencia en el Congreso de Tecnologías de la Universidad ECCI.',
    tags: ['PostGIS', 'SIG', 'Liderazgo'],
    detail: {
      role: 'Líder de Proyecto · Jun – Nov 2024',
      intro: 'Sistema de Información Geográfica (SIG) para integrar y analizar datos geoespaciales, con potencial de impacto social y mejora de políticas públicas.',
      points: [
        'Lideré al equipo en la integración y análisis de datos geoespaciales con PostgreSQL/PostGIS.',
        'Diseño de interfaces para la exploración de los datos.',
        'Ponencia en el Congreso de Tecnologías de la Universidad ECCI.',
      ],
      tags: ['PostGIS', 'SIG', 'Liderazgo', 'UI'],
    },
  },
];
