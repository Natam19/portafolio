/**
 * Fondo animado del hero: una red de datos (nodos que se mueven y se unen
 * con líneas cuando están cerca). El cursor atrae a los nodos cercanos.
 *
 * - Usa el color de acento (--ac) y se adapta al tema claro / oscuro.
 * - Se pausa cuando el hero no está en pantalla o la pestaña está oculta.
 * - Con "reducir movimiento" se dibuja una sola vez, quieta.
 */

export function initNet(canvas) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const page = document.getElementById('top');
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  let w = 0, h = 0, dpr = 1, nodes = [], running = false, raf = 0;
  const mouse = { x: -9999, y: -9999 };

  function accent() {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--ac').trim() || '#7C3AED';
    const m = v.match(/^#([0-9a-f]{6})$/i);
    if (!m) return [124, 58, 237];
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Menos nodos en pantallas pequeñas.
    const count = Math.round(Math.min(70, Math.max(26, (w * h) / 16000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1.2 + Math.random() * 1.8,
    }));
  }

  function draw() {
    const [r, g, b] = accent();
    const dark = page?.classList.contains('dark');
    const base = dark ? 0.55 : 0.38;
    ctx.clearRect(0, 0, w, h);
    const link = Math.min(150, Math.max(90, w / 10));

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const c = nodes[j];
        const dx = a.x - c.x, dy = a.y - c.y;
        const d = Math.hypot(dx, dy);
        if (d < link) {
          ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d / link) * base * 0.55})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
        }
      }
      const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      const near = md < 160;
      ctx.fillStyle = `rgba(${r},${g},${b},${near ? Math.min(1, base + 0.35) : base})`;
      ctx.beginPath(); ctx.arc(a.x, a.y, near ? a.r + 1 : a.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  function step() {
    for (const n of nodes) {
      // Atracción suave hacia el cursor.
      const dx = mouse.x - n.x, dy = mouse.y - n.y;
      const d = Math.hypot(dx, dy);
      if (d < 160 && d > 1) { n.vx += (dx / d) * 0.012; n.vy += (dy / d) * 0.012; }
      n.vx *= 0.995; n.vy *= 0.995;
      const sp = Math.hypot(n.vx, n.vy);
      if (sp > 0.9) { n.vx *= 0.9 / sp; n.vy *= 0.9 / sp; }
      if (sp < 0.08) { n.vx += (Math.random() - 0.5) * 0.05; n.vy += (Math.random() - 0.5) * 0.05; }
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      n.x = Math.max(0, Math.min(w, n.x));
      n.y = Math.max(0, Math.min(h, n.y));
    }
    draw();
    raf = requestAnimationFrame(step);
  }

  function start() { if (!running && !reduce) { running = true; raf = requestAnimationFrame(step); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  resize();
  draw();
  if (reduce) return;

  window.addEventListener('resize', () => { resize(); draw(); });
  const hero = canvas.parentElement;
  hero.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });

  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
}
