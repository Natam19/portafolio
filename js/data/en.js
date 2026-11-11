/**
 * Traducciones al inglés del contenido que se pinta desde JS.
 * El español sigue viviendo en projects.js y site.js; aquí solo va el inglés,
 * con la misma forma, para que lang.js lo combine según el idioma elegido.
 */

/** Proyectos, por id. Solo los campos que cambian de idioma. */
export const projectsEn = {
  pulso: {
    summary: 'Cardiovascular health PWA with a metrics dashboard, 30-day trends and streaming AI analysis. AI-generated recipes and workouts, no account and no personal data.',
    detail: {
      role: 'Developer · Personal project · 2026',
      intro: 'AI-powered progressive web app (PWA) for cardiovascular health: it logs metrics, shows trends and delivers personalized analysis and recommendations in real time — with no account and no personal data.',
      points: [
        'Metrics dashboard with 30-day trend charts (Recharts).',
        'Personalized AI analysis with streaming responses.',
        'AI-generated recipes and workout routines (Claude + Imagen 3).',
        'Supabase persistence with privacy by design: no account and no personal data.',
      ],
    },
  },
  iso: {
    summary: 'ISMS platform aligned with ISO/IEC 27001:2022 — KPIs, incidents, controls, risks and audits. Threat modeling with PASTA + STRIDE on a layered REST API.',
    detail: {
      role: 'Developer · Universidad de San Buenaventura · 2026',
      intro: 'Information security management system (ISMS) platform aligned with ISO/IEC 27001:2022: it turns compliance into an operational, measurable and auditable dashboard.',
      points: [
        'KPI dashboard, incident management, ISO controls, risk assessment and audits.',
        'Layered backend with a REST API (FastAPI/Python) and a React + Vite frontend.',
        'JWT authentication with role-based access control (RBAC) on PostgreSQL/Supabase.',
        'Threat modeling with PASTA + STRIDE: DFD, risk matrix and OWASP/ISO mapping.',
      ],
    },
  },
  health: {
    summary: 'Breast cancer risk prediction with Big Data: ~6.7M mammograms (BCSC) processed with Spark, an epidemiological dashboard and deployment on AWS.',
    detail: {
      role: 'Developer · Universidad de San Buenaventura · 2026',
      intro: 'Web system that predicts breast cancer risk using Big Data: it processes millions of clinical records to estimate individual risk and visualize epidemiological patterns.',
      points: [
        'Processing of the BCSC dataset (~6.7M mammograms) with Apache Spark.',
        'Classification model trained with Scikit-learn.',
        'FastAPI backend integrated with a React + Vite frontend.',
        'Epidemiological dashboard in Power BI.',
        'Deployment on AWS (S3, Kinesis Firehose, EC2) with Docker.',
      ],
    },
  },
  agro: {
    summary: 'Genetic algorithms to predict optimal planting conditions. Presented at the NASA Space Apps Challenge.',
    tags: ['Front-End', 'Genetic algorithms', 'NASA Space Apps'],
    detail: {
      role: 'Front-End Developer · NASA Space Apps Challenge · Oct 2024',
      intro: 'Application that uses genetic algorithms to predict the best planting conditions for specific areas — technology serving agriculture and sustainability.',
      points: [
        'Front-end development of the application.',
        'Collaboration on integrating the genetic prediction algorithms.',
        'Project presented at the NASA Space Apps Challenge 2024.',
      ],
      tags: ['Front-End', 'Genetic algorithms', 'Sustainability'],
    },
  },
  geo: {
    summary: 'Led a GIS for geospatial analysis with public policy impact. Talk at the Universidad ECCI Technology Congress.',
    tags: ['PostGIS', 'GIS', 'Leadership'],
    detail: {
      role: 'Project Lead · Jun – Nov 2024',
      intro: 'Geographic Information System (GIS) to integrate and analyze geospatial data, with potential social impact and better public policies.',
      points: [
        'Led the team integrating and analyzing geospatial data with PostgreSQL/PostGIS.',
        'Designed interfaces to explore the data.',
        'Talk at the Universidad ECCI Technology Congress.',
      ],
      tags: ['PostGIS', 'GIS', 'Leadership', 'UI'],
    },
  },
  vocacional: {
    title: 'Career Test',
    summary: 'App that runs a career aptitude test and guides students toward academic programs that match their profile, with a decoupled AI advisor.',
    detail: {
      role: 'Front-End Developer · Team project · 2026',
      intro: 'Web platform that runs a career test and points each student to the academic programs that best fit their profile. Service-based, contract-first architecture.',
      points: [
        'Frontend development in Angular (SPA).',
        'Integration with the .NET 8 backend (Clean Architecture) through a REST contract.',
        'AI advisor chat that always goes through the backend: the browser never stores API keys.',
        'Containerized services orchestrated with Docker Compose.',
      ],
    },
  },
  saberpro: {
    summary: 'App to prepare for Colombia’s Saber Pro exam (ICFES): study by module, timed mock tests, scoring, review and progress tracking.',
    detail: {
      role: 'Developer · Personal project · 2026',
      intro: 'Web app to prepare for the Saber Pro exam: general and engineering modules, configurable mock tests and question-by-question review.',
      points: [
        'Configurable mock tests (5 to 50 questions) with a real-pace timer.',
        'Scores by module and review with the correct answer and its explanation.',
        'Writing practice with a timer and word counter.',
        'Progress history saved in the browser (localStorage).',
      ],
    },
  },
};

/** Experiencia, en el mismo orden que site.js. */
export const experienceEn = [
  {
    role: 'Web Developer',
    description: 'Scalable, high-performance web solutions for the Spanish market: information architecture, UX-centered navigation, SEO and conversion-oriented WordPress.',
    period: 'Dec 2025 — Jun 2026',
    place: 'Málaga, Spain · remote',
  },
  {
    role: 'Teaching Assistant — AI and Cybersecurity',
    description: 'Supported students in Artificial Intelligence and Cybersecurity: technical concepts, digital skills and hands-on application.',
    period: 'Oct 2025',
    place: 'Colombia',
  },
  {
    role: 'Teaching Assistant — Information Security',
    description: 'Training on digital threats, best practices and data protection, strengthening the security culture in academia.',
    period: 'Aug 2025',
    place: 'Colombia',
  },
];

/** Educación, en el mismo orden que site.js. */
export const educationEn = [
  { name: 'B.S. in Systems Engineering', year: '2022 — Present' },
  { name: 'Diploma in Project Management' },
  { name: 'Technical degree in Multimedia Design and Integration' },
];

/** Certificaciones e idiomas, en el mismo orden que site.js. */
export const certificationsEn = [
  { name: 'Software quality in the development process' },
  { name: 'Data analytics for logistics processes' },
  { name: 'English course', year: '2025 — Present' },
  { name: 'Languages', org: 'Spanish (native) · English A2, in progress' },
];

/** Textos de la interfaz que se arman en JS. */
export const uiEn = {
  seeProject: 'See project →',
  built: 'What I built',
  live: 'Live demo ↗',
  code: 'See code ↗',
  close: 'Close',
};
export const uiEs = {
  seeProject: 'Ver proyecto →',
  built: 'Qué construí',
  live: 'Ver en vivo ↗',
  code: 'Ver código ↗',
  close: 'Cerrar',
};
