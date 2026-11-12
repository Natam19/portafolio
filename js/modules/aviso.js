/**
 * Aviso de visitas: manda un pulso al webhook de n8n (servidor de Rocky),
 * que le escribe a Natalia por Telegram. El token del bot vive en n8n,
 * nunca en esta página.
 *
 * - Una sola vez por visita (sessionStorage), no en cada recarga.
 * - Las visitas de Natalia no avisan ni cuentan en Umami: basta abrir una
 *   vez la página con ?yo=1 en cada dispositivo suyo (queda en localStorage).
 * - No se manda nada personal del visitante: solo dispositivo, país
 *   aproximado (por la zona horaria del equipo, sin IP), de dónde llegó,
 *   idioma y si descargó la hoja de vida.
 * - Mientras WEBHOOK esté vacío no hace nada.
 */
const WEBHOOK = 'https://n8n.agustinynatalia.site/webhook/portafolio-visita'; // URL del webhook de n8n (la entrega Rocky)

function soyYo() {
  try {
    if (new URLSearchParams(location.search).has('yo')) {
      localStorage.setItem('nm-yo', '1');
      localStorage.setItem('umami.disabled', '1'); // Umami tampoco la cuenta
    }
    return localStorage.getItem('nm-yo') === '1';
  } catch { return false; }
}

// Zona horaria -> país. Si no está en la lista, se usa la ciudad de la zona.
const PAISES = {
  'America/Bogota': 'Colombia', 'America/Mexico_City': 'México', 'America/Monterrey': 'México',
  'America/Tijuana': 'México', 'America/Cancun': 'México', 'America/Lima': 'Perú',
  'America/Guayaquil': 'Ecuador', 'America/Caracas': 'Venezuela', 'America/Santiago': 'Chile',
  'America/Argentina/Buenos_Aires': 'Argentina', 'America/Buenos_Aires': 'Argentina',
  'America/Sao_Paulo': 'Brasil', 'America/Panama': 'Panamá', 'America/Costa_Rica': 'Costa Rica',
  'America/Guatemala': 'Guatemala', 'America/El_Salvador': 'El Salvador', 'America/Tegucigalpa': 'Honduras',
  'America/Managua': 'Nicaragua', 'America/Santo_Domingo': 'República Dominicana', 'America/Puerto_Rico': 'Puerto Rico',
  'America/La_Paz': 'Bolivia', 'America/Asuncion': 'Paraguay', 'America/Montevideo': 'Uruguay',
  'America/New_York': 'Estados Unidos', 'America/Chicago': 'Estados Unidos', 'America/Denver': 'Estados Unidos',
  'America/Los_Angeles': 'Estados Unidos', 'America/Phoenix': 'Estados Unidos', 'America/Toronto': 'Canadá',
  'America/Vancouver': 'Canadá', 'Europe/Madrid': 'España', 'Atlantic/Canary': 'España',
  'Europe/London': 'Reino Unido', 'Europe/Paris': 'Francia', 'Europe/Berlin': 'Alemania',
  'Europe/Rome': 'Italia', 'Europe/Lisbon': 'Portugal', 'Asia/Kolkata': 'India', 'Asia/Calcutta': 'India',
};

function pais() {
  try {
    const zona = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    return PAISES[zona] || zona.split('/').pop().replace(/_/g, ' ') || '';
  } catch { return ''; }
}

function origen() {
  if (!document.referrer) return 'link directo';
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, '');
    return host === location.hostname ? 'link directo' : host;
  } catch { return 'desconocido'; }
}

function enviar(evento) {
  const datos = {
    evento,
    dispositivo: (window.matchMedia('(pointer: coarse)').matches ? 'celular' : 'computador')
      + (pais() ? ` (${pais()})` : ''),
    origen: origen(),
    idioma: document.documentElement.lang || 'es',
  };
  // text/plain evita la consulta previa de CORS; n8n lo lee como texto.
  const cuerpo = new Blob([JSON.stringify(datos)], { type: 'text/plain' });
  if (!navigator.sendBeacon?.(WEBHOOK, cuerpo)) {
    fetch(WEBHOOK, { method: 'POST', body: cuerpo, keepalive: true, mode: 'no-cors' }).catch(() => {});
  }
}

export function initAviso() {
  if (!WEBHOOK || navigator.webdriver || soyYo()) return;
  try {
    if (!sessionStorage.getItem('nm-aviso')) {
      sessionStorage.setItem('nm-aviso', '1');
      enviar('visita');
    }
  } catch { /* sin almacenamiento: no avisamos */ }

  document.querySelectorAll('a[href*="CV-Natalia-Moncaleano"]').forEach((a) => {
    a.addEventListener('click', () => enviar('descarga_hoja_de_vida'));
  });
}
