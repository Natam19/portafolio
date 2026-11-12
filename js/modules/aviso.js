/**
 * Aviso de visitas: manda un pulso al webhook de n8n (servidor de Rocky),
 * que le escribe a Natalia por Telegram. El token del bot vive en n8n,
 * nunca en esta página.
 *
 * - Una sola vez por visita (sessionStorage), no en cada recarga.
 * - Las visitas de Natalia no avisan ni cuentan en Umami: basta abrir una
 *   vez la página con ?yo=1 en cada dispositivo suyo (queda en localStorage).
 * - No se manda nada personal del visitante: solo dispositivo, de dónde
 *   llegó, idioma y si descargó la hoja de vida.
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
    dispositivo: window.matchMedia('(pointer: coarse)').matches ? 'celular' : 'computador',
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
