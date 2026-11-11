/**
 * Minijuego "Defiende la red" (estilo Asteroids).
 * Una nave escudo dispara a las amenazas (malware, phishing, SQLi...).
 *
 * - Teclado: WASD o flechas para moverse, ESPACIO para disparar. Solo se
 *   capturan las teclas cuando el juego tiene el foco o el cursor encima,
 *   así no se rompe el scroll con la barra espaciadora en el resto de la página.
 * - Toque o clic: la nave gira hacia ese punto y dispara (sirve en celular).
 * - Si nadie juega, la nave se defiende sola (piloto automático).
 * - Se pausa fuera de pantalla o con la pestaña oculta. Con "reducir
 *   movimiento" se dibuja una sola escena quieta.
 */
import { getLang, onLangChange } from './lang.js';

const THREATS = ['malware', 'phishing', 'SQLi', 'DDoS', 'ransomware', 'XSS', 'spyware', 'botnet'];
const BG = 'rgba(21, 17, 43, 0.35)'; // estela: el fondo se pinta semitransparente
const SHIP = '#C4B5FD';
const ROCK = 'rgba(240, 171, 252, 0.85)';
const TEXT = 'rgba(233, 230, 250, 0.75)';

const LABELS = {
  es: { score: 'Amenazas bloqueadas', aria: 'Minijuego: defiende la red disparando a las amenazas' },
  en: { score: 'Threats blocked', aria: 'Mini game: defend the network by shooting the threats' },
};

export function initGame(box) {
  const canvas = box?.querySelector('canvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  // Capa de textos encima: se limpia en cada cuadro, así los nombres y el
  // marcador quedan nítidos (la estela solo la llevan las figuras).
  const hud = document.createElement('canvas');
  hud.className = 'ghud';
  hud.setAttribute('aria-hidden', 'true');
  canvas.after(hud);
  const tx = hud.getContext('2d');
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  let w = 0, h = 0, raf = 0, running = false;
  let ship, bullets = [], rocks = [], sparks = [], score = 0;
  let hover = false, lastInput = -1e9, cooldown = 0, autoFire = 0;
  const keys = {};

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    hud.width = canvas.width;
    hud.height = canvas.height;
    tx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#15112B';
    ctx.fillRect(0, 0, w, h);
  }

  function rock(x, y, radius, vel) {
    const pts = Array.from({ length: 9 }, () => 0.72 + Math.random() * 0.28);
    return {
      x, y, radius, pts,
      vx: vel?.x ?? (Math.random() - 0.5) * 2.2,
      vy: vel?.y ?? (Math.random() - 0.5) * 2.2,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.04,
      label: THREATS[Math.floor(Math.random() * THREATS.length)],
    };
  }

  function wave() {
    const n = w < 560 ? 3 : 4;
    rocks = [];
    for (let i = 0; i < n; i++) {
      // Que no aparezcan encima de la nave.
      let x, y;
      do { x = Math.random() * w; y = Math.random() * h; } while (Math.hypot(x - ship.x, y - ship.y) < 120);
      rocks.push(rock(x, y, w < 560 ? 30 : 38));
    }
  }

  function reset() {
    ship = { x: w / 2, y: h / 2, a: -Math.PI / 2, vx: 0, vy: 0 };
    bullets = []; sparks = []; score = 0;
    wave();
  }

  function wrap(o) {
    if (o.x < 0) o.x += w; else if (o.x > w) o.x -= w;
    if (o.y < 0) o.y += h; else if (o.y > h) o.y -= h;
  }

  function fire() {
    if (cooldown > 0) return;
    cooldown = 9;
    bullets.push({
      x: ship.x + Math.cos(ship.a) * 15,
      y: ship.y + Math.sin(ship.a) * 15,
      vx: Math.cos(ship.a) * 6.5 + ship.vx,
      vy: Math.sin(ship.a) * 6.5 + ship.vy,
      life: 70,
    });
  }

  // Gira la nave hacia un ángulo, sin pasarse.
  function turnTo(target, speed) {
    let d = target - ship.a;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    ship.a += Math.max(-speed, Math.min(speed, d));
    return Math.abs(d);
  }

  function autopilot() {
    if (!rocks.length) return;
    let near = rocks[0], best = Infinity;
    for (const r of rocks) {
      const d = Math.hypot(r.x - ship.x, r.y - ship.y);
      if (d < best) { best = d; near = r; }
    }
    // Apunta un poco adelante de la amenaza.
    const t = best / 6.5;
    const off = turnTo(Math.atan2(near.y + near.vy * t - ship.y, near.x + near.vx * t - ship.x), 0.05);
    if (off < 0.15 && --autoFire <= 0) { fire(); autoFire = 22; }
    ship.x += Math.cos(performance.now() / 2200) * 0.25;
    ship.y += Math.sin(performance.now() / 2700) * 0.2;
  }

  function update() {
    if (cooldown > 0) cooldown--;
    const playing = performance.now() - lastInput < 6000;
    if (playing) {
      if (keys.a || keys.arrowleft) ship.a -= 0.09;
      if (keys.d || keys.arrowright) ship.a += 0.09;
      if (keys.w || keys.arrowup) { ship.vx += Math.cos(ship.a) * 0.32; ship.vy += Math.sin(ship.a) * 0.32; }
      if (keys.s || keys.arrowdown) { ship.vx *= 0.9; ship.vy *= 0.9; }
      if (keys[' ']) fire();
    } else {
      autopilot();
    }
    ship.vx *= 0.985; ship.vy *= 0.985;
    ship.x += ship.vx; ship.y += ship.vy;
    wrap(ship);

    for (const b of bullets) { b.x += b.vx; b.y += b.vy; b.life--; wrap(b); }
    bullets = bullets.filter((b) => b.life > 0);

    for (const r of rocks) { r.x += r.vx; r.y += r.vy; r.rot += r.vr; wrap(r); }

    for (let i = bullets.length - 1; i >= 0; i--) {
      for (let j = rocks.length - 1; j >= 0; j--) {
        const r = rocks[j], b = bullets[i];
        if (Math.hypot(b.x - r.x, b.y - r.y) < r.radius) {
          for (let k = 0; k < 12; k++) {
            sparks.push({ x: r.x, y: r.y, vx: (Math.random() - 0.5) * 4.5, vy: (Math.random() - 0.5) * 4.5, life: 1, s: 1 + Math.random() * 2.5 });
          }
          if (r.radius > 18) {
            for (let k = 0; k < 2; k++) {
              rocks.push(rock(r.x, r.y, r.radius / 1.6, { x: r.vx + (Math.random() - 0.5) * 2.4, y: r.vy + (Math.random() - 0.5) * 2.4 }));
            }
          }
          rocks.splice(j, 1);
          bullets.splice(i, 1);
          score += 10;
          break;
        }
      }
    }
    if (!rocks.length) { score += 100; wave(); }

    for (const s of sparks) { s.x += s.vx; s.y += s.vy; s.life -= 0.02; }
    sparks = sparks.filter((s) => s.life > 0);
  }

  function draw() {
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);
    tx.clearRect(0, 0, w, h);

    // Amenazas (con brillo neón).
    ctx.lineWidth = 1.8;
    ctx.shadowBlur = 12;
    ctx.shadowColor = ROCK;
    tx.font = '600 10.5px ui-monospace, SFMono-Regular, Menlo, monospace';
    tx.textAlign = 'center';
    tx.textBaseline = 'middle';
    tx.fillStyle = TEXT;
    for (const r of rocks) {
      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.rotate(r.rot);
      ctx.strokeStyle = ROCK;
      ctx.beginPath();
      r.pts.forEach((k, i) => {
        const ang = (i / r.pts.length) * Math.PI * 2;
        const x = Math.cos(ang) * r.radius * k, y = Math.sin(ang) * r.radius * k;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      if (r.radius > 18) tx.fillText(r.label, r.x, r.y);
    }

    // Disparos y chispas.
    ctx.shadowColor = SHIP;
    ctx.fillStyle = SHIP;
    for (const b of bullets) { ctx.beginPath(); ctx.arc(b.x, b.y, 2.2, 0, Math.PI * 2); ctx.fill(); }
    for (const s of sparks) {
      ctx.fillStyle = `rgba(240, 171, 252, ${s.life})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2); ctx.fill();
    }

    // Nave escudo.
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.a);
    ctx.strokeStyle = SHIP;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(16, 0); ctx.lineTo(-10, -10); ctx.lineTo(-5, 0); ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.stroke();
    if (Math.hypot(ship.vx, ship.vy) > 0.4) {
      ctx.strokeStyle = 'rgba(196, 181, 253, 0.55)';
      ctx.beginPath(); ctx.moveTo(-7, -4); ctx.lineTo(-15, 0); ctx.lineTo(-7, 4); ctx.stroke();
    }
    ctx.restore();
    ctx.shadowBlur = 0;

    // Marcador.
    tx.textAlign = 'left';
    tx.textBaseline = 'top';
    tx.font = '600 12px ui-monospace, SFMono-Regular, Menlo, monospace';
    tx.fillText(`${LABELS[getLang()].score}: ${score}`, 14, 14);
  }

  function loop() {
    update();
    draw();
    raf = requestAnimationFrame(loop);
  }
  function start() { if (!running && !reduce) { running = true; raf = requestAnimationFrame(loop); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  function setAria() { box.setAttribute('aria-label', LABELS[getLang()].aria); }

  resize();
  reset();
  setAria();
  onLangChange(setAria);
  if (reduce) {
    ctx.fillStyle = '#15112B';
    ctx.fillRect(0, 0, w, h);
    draw();
    return;
  }

  // Teclado: solo cuando el juego está activo (foco o cursor encima).
  const active = () => hover || box.contains(document.activeElement);
  const GAME_KEYS = ['w', 'a', 's', 'd', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (!GAME_KEYS.includes(k) || !active()) return;
    e.preventDefault();
    keys[k] = true;
    lastInput = performance.now();
  });
  document.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });
  box.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

  box.addEventListener('pointerenter', () => { hover = true; });
  box.addEventListener('pointerleave', () => { hover = false; for (const k in keys) keys[k] = false; });

  // Toque o clic: girar hacia ese punto y disparar.
  box.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    ship.a = Math.atan2(y - ship.y, x - ship.x);
    cooldown = 0;
    fire();
    lastInput = performance.now();
  });

  window.addEventListener('resize', () => {
    const fx = ship.x / w, fy = ship.y / h;
    resize();
    ship.x = fx * w; ship.y = fy * h;
  });

  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
}
