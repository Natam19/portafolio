/**
 * Demo en vivo: "de la consulta al tablero".
 * Cada pestaña escribe una consulta (letra por letra), cuenta un KPI y
 * levanta las barras del gráfico. Los valores son de ejemplo, salvo los
 * controles de ISO 27001:2022 (93 controles en 4 temas del Anexo A).
 */
import { getLang, onLangChange } from './lang.js?v=2026111208';

const DEMOS = {
  health: {
    file: 'riesgo_por_edad.sql',
    code: [
      'SELECT grupo_edad,',
      '       ROUND(AVG(riesgo) * 100, 1) AS riesgo_pct',
      'FROM mamografias  -- 6,7 M registros',
      'WHERE anio >= 2018',
      'GROUP BY grupo_edad',
      'ORDER BY grupo_edad;',
    ],
    kpi: 6.7, dec: 1, suffix: ' M',
    kpiLabel: { es: 'registros procesados', en: 'records processed' },
    bars: [['40–49', 34], ['50–59', 52], ['60–69', 71], ['70+', 88]],
    sample: true,
  },
  iso: {
    file: 'controles_iso27001.sql',
    code: [
      'SELECT tema, COUNT(*) AS controles',
      'FROM controles_anexo_a',
      "WHERE norma = 'ISO/IEC 27001:2022'",
      'GROUP BY tema',
      'ORDER BY controles DESC;',
    ],
    kpi: 93, dec: 0, suffix: '',
    kpiLabel: { es: 'controles en la plataforma', en: 'controls in the platform' },
    bars: [
      [{ es: 'Organiz.', en: 'Organiz.' }, 37],
      [{ es: 'Tecnol.', en: 'Technol.' }, 34],
      [{ es: 'Físicos', en: 'Physical' }, 14],
      [{ es: 'Personas', en: 'People' }, 8],
    ],
    max: 37,
    sample: false,
  },
  pulso: {
    file: 'tendencia_presion.py',
    code: [
      'import pandas as pd',
      "df = pd.read_sql('SELECT * FROM metricas', con)",
      'semana = (df.tail(7)',
      "          .groupby('dia')['sistolica']",
      '          .mean().round())',
      'print(semana)',
    ],
    kpi: 30, dec: 0, suffix: '',
    kpiLabel: { es: 'días de tendencia', en: 'days of trends' },
    bars: [
      [{ es: 'Lu', en: 'Mo' }, 128], [{ es: 'Ma', en: 'Tu' }, 124], [{ es: 'Mi', en: 'We' }, 121],
      [{ es: 'Ju', en: 'Th' }, 123], [{ es: 'Vi', en: 'Fr' }, 119], [{ es: 'Sá', en: 'Sa' }, 117], [{ es: 'Do', en: 'Su' }, 118],
    ],
    max: 140,
    sample: true,
  },
};

const KW = /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|AS|DESC|ROUND|AVG|COUNT|import|as|print)\b/g;

function highlight(line) {
  const esc = line.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const [code, comment] = esc.split(/(?=--|#)/);
  let out = code
    .replace(/('[^']*')/g, '<span class="tk-s">$1</span>')
    .replace(KW, '<span class="tk-k">$1</span>')
    .replace(/\b(\d+(?:[.,]\d+)?)\b/g, '<span class="tk-n">$1</span>');
  if (comment) out += `<span class="tk-c">${comment}</span>`;
  return out;
}

const label = (v) => (typeof v === 'object' ? v[getLang()] : v);

export function initDemo() {
  const tabs = [...document.querySelectorAll('.dtabs [data-demo]')];
  const codeEl = document.getElementById('demo-code');
  const fileEl = document.getElementById('demo-file');
  const kpiEl = document.getElementById('demo-kpi');
  const kpiLbl = document.getElementById('demo-kpil');
  const chart = document.getElementById('demo-chart');
  if (!tabs.length || !codeEl) return;

  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let current = 'health';
  let run = 0; // invalida animaciones viejas al cambiar de pestaña
  let started = false;

  function fmt(v, dec) {
    const s = v.toFixed(dec);
    return getLang() === 'en' ? s : s.replace('.', ',');
  }

  function drawChart(d, grow) {
    const max = d.max || 100;
    chart.replaceChildren(...d.bars.map(([name, val], i) => {
      const col = document.createElement('div');
      col.className = 'dcol';
      const bar = document.createElement('span');
      bar.className = 'dbarv';
      bar.style.setProperty('--h', `${Math.max(6, (val / max) * 100)}%`);
      bar.style.transitionDelay = `${i * 70}ms`;
      bar.dataset.v = val;
      const lab = document.createElement('small');
      lab.textContent = label(name);
      col.append(bar, lab);
      return col;
    }));
    chart.dataset.sample = d.sample ? (getLang() === 'en' ? 'Sample data' : 'Datos de ejemplo') : '';
    if (grow) requestAnimationFrame(() => requestAnimationFrame(() => chart.classList.add('up')));
    else chart.classList.add('up');
  }

  function showStatic(d) {
    codeEl.innerHTML = d.code.map(highlight).join('\n');
    kpiEl.textContent = fmt(d.kpi, d.dec) + d.suffix;
    drawChart(d, false);
  }

  async function play(key) {
    const id = ++run;
    const d = DEMOS[key];
    fileEl.textContent = d.file;
    kpiLbl.textContent = d.kpiLabel[getLang()];
    chart.classList.remove('up');
    if (reduce) { showStatic(d); return; }

    // 1) Escribir la consulta.
    codeEl.innerHTML = '';
    const lines = [];
    for (const line of d.code) {
      let typed = '';
      for (const ch of line) {
        if (id !== run) return;
        typed += ch;
        codeEl.innerHTML = [...lines, highlight(typed)].map((l) => l).join('\n') + '<span class="caret"></span>';
        await new Promise((r) => setTimeout(r, ch === ' ' ? 8 : 18));
      }
      lines.push(highlight(line));
    }
    codeEl.innerHTML = lines.join('\n') + '<span class="caret"></span>';

    // 2) KPI que cuenta y barras que suben.
    drawChart(d, true);
    const t0 = performance.now();
    const tick = (t) => {
      if (id !== run) return;
      const p = Math.min(1, (t - t0) / 900);
      kpiEl.textContent = fmt(d.kpi * (1 - Math.pow(1 - p, 3)), d.dec) + d.suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function select(key) {
    current = key;
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.demo === key)));
    play(key);
  }

  tabs.forEach((t) => t.addEventListener('click', () => select(t.dataset.demo)));

  // Arranca cuando la tarjeta entra en pantalla.
  const card = document.querySelector('.dcard');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { started = true; select(current); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(card);
  } else {
    started = true;
    select(current);
  }

  // Al cambiar de idioma: actualizar etiquetas sin volver a escribir todo.
  onLangChange(() => {
    if (!started) return;
    const d = DEMOS[current];
    kpiLbl.textContent = d.kpiLabel[getLang()];
    run++;
    showStatic(d);
  });
}
