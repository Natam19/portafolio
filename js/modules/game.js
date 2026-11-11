/**
 * Minijuego estilo Asteroids, igual al del portafolio de referencia:
 * asteroides de contorno que tiemblan y dejan una estela larga (el fondo se
 * pinta casi transparente en cada cuadro, por eso se ven como tubos en 3D).
 *
 * - Teclado: WASD o flechas para pilotar, ESPACIO para disparar. Solo se
 *   capturan las teclas cuando el juego tiene el foco o el cursor encima,
 *   así la barra espaciadora sigue bajando la página en el resto del sitio.
 * - Toque o clic: la nave gira hacia ese punto y dispara (sirve en celular).
 * - Se pausa fuera de pantalla o con la pestaña oculta. Con "reducir
 *   movimiento" se dibuja una sola escena quieta.
 */
import { getLang } from './lang.js?v=2026111102';

const COLOR = '168, 85, 247'; // morado neón del portafolio (r, g, b)
const BG = '13, 10, 30';      // fondo morado casi negro (r, g, b)

export function initGame(box) {
  const canvas = box?.querySelector('canvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  let w = 0, h = 0, raf = 0, running = false, hover = false;
  let ship, bullets = [], asteroids = [], particles = [];
  const keys = {};

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = `rgb(${BG})`;
    ctx.fillRect(0, 0, w, h);
  }

  function asteroid(x, y, radius, vx, vy, rotation) {
    return {
      x, y, radius,
      vx: vx ?? (Math.random() - 0.5) * 3,
      vy: vy ?? (Math.random() - 0.5) * 3,
      rotation: rotation ?? Math.random() * Math.PI * 2,
      rotVel: (Math.random() - 0.5) * 0.1,
    };
  }

  function initAsteroids() {
    asteroids = [];
    for (let i = 0; i < 3; i++) asteroids.push(asteroid(Math.random() * w, Math.random() * h, 40));
  }

  function wrap(o) {
    if (o.x < 0) o.x = w; else if (o.x > w) o.x = 0;
    if (o.y < 0) o.y = h; else if (o.y > h) o.y = 0;
  }

  function fire() {
    bullets.push({
      x: ship.x + Math.cos(ship.angle) * 15,
      y: ship.y + Math.sin(ship.angle) * 15,
      vx: Math.cos(ship.angle) * 6 + ship.vx,
      vy: Math.sin(ship.angle) * 6 + ship.vy,
    });
  }

  function update() {
    if (keys.w || keys.arrowup) { ship.vx += Math.cos(ship.angle) * 0.5; ship.vy += Math.sin(ship.angle) * 0.5; }
    if (keys.a || keys.arrowleft) ship.angle -= 0.1;
    if (keys.d || keys.arrowright) ship.angle += 0.1;
    ship.vx *= 0.99; ship.vy *= 0.99;
    ship.x += ship.vx; ship.y += ship.vy;
    wrap(ship);

    for (const b of bullets) { b.x += b.vx; b.y += b.vy; }
    bullets = bullets.filter((b) => b.x >= 0 && b.x <= w && b.y >= 0 && b.y <= h);

    for (const a of asteroids) { a.x += a.vx; a.y += a.vy; a.rotation += a.rotVel; wrap(a); }

    for (const p of particles) { p.x += p.vx; p.y += p.vy; p.life -= 0.01; }
    particles = particles.filter((p) => p.life > 0);

    for (let i = bullets.length - 1; i >= 0; i--) {
      for (let j = asteroids.length - 1; j >= 0; j--) {
        const a = asteroids[j], b = bullets[i];
        if (Math.hypot(b.x - a.x, b.y - a.y) < a.radius) {
          for (let k = 0; k < 8; k++) {
            particles.push({ x: a.x, y: a.y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, size: Math.random() * 3 + 1, life: 1 });
          }
          if (a.radius > 20) {
            for (let k = 0; k < 2; k++) {
              asteroids.push(asteroid(a.x, a.y, a.radius / 1.5,
                a.vx + (Math.random() - 0.5) * 2, a.vy + (Math.random() - 0.5) * 2, a.rotation));
            }
          }
          asteroids.splice(j, 1);
          bullets.splice(i, 1);
          ship.score += 10;
          break;
        }
      }
    }
    if (!asteroids.length) { initAsteroids(); ship.score += 100; }
  }

  function draw() {
    // Fondo casi transparente: lo de antes se desvanece despacio (la estela).
    ctx.fillStyle = `rgba(${BG}, 0.1)`;
    ctx.fillRect(0, 0, w, h);

    // Nave.
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    ctx.strokeStyle = `rgb(${COLOR})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(15, 0); ctx.lineTo(-10, -10); ctx.lineTo(-5, 0); ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.stroke();
    if (ship.vx || ship.vy) {
      ctx.strokeStyle = `rgba(${COLOR}, 0.6)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-5, 5); ctx.lineTo(-10, -5); ctx.moveTo(-5, -5); ctx.lineTo(-10, 5);
      ctx.stroke();
    }
    ctx.restore();

    // Asteroides: el contorno tiembla un poco en cada cuadro.
    ctx.strokeStyle = `rgba(${COLOR}, 0.8)`;
    ctx.lineWidth = 2;
    for (const a of asteroids) {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rotation);
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const r = a.radius * (0.7 + Math.random() * 0.3);
        const x = Math.cos(ang) * r, y = Math.sin(ang) * r;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    // Disparos y partículas.
    ctx.fillStyle = `rgb(${COLOR})`;
    for (const b of bullets) { ctx.beginPath(); ctx.arc(b.x, b.y, 2, 0, Math.PI * 2); ctx.fill(); }
    for (const p of particles) {
      ctx.fillStyle = `rgba(${COLOR}, ${p.life})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    }

    // Marcador.
    ctx.fillStyle = `rgb(${COLOR})`;
    ctx.font = '12px monospace';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(`${getLang() === 'en' ? 'Score' : 'Puntos'}: ${ship.score}`, 12, 20);
  }

  function loop() { update(); draw(); raf = requestAnimationFrame(loop); }
  function start() { if (!running && !reduce) { running = true; raf = requestAnimationFrame(loop); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  resize();
  ship = { x: w / 2, y: h / 2, angle: 0, vx: 0, vy: 0, score: 0 };
  initAsteroids();
  if (reduce) { draw(); return; }

  // Teclado: solo cuando el juego está activo (foco o cursor encima).
  const active = () => hover || box.contains(document.activeElement);
  const GAME_KEYS = ['w', 'a', 's', 'd', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (!GAME_KEYS.includes(k) || !active()) return;
    e.preventDefault();
    if (k === ' ') fire();
    keys[k] = true;
  });
  document.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });
  const release = () => { for (const k in keys) keys[k] = false; };
  box.addEventListener('blur', release);
  box.addEventListener('pointerenter', () => { hover = true; });
  box.addEventListener('pointerleave', () => { hover = false; release(); });

  // Toque o clic: girar hacia ese punto y disparar.
  box.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    ship.angle = Math.atan2(e.clientY - r.top - ship.y, e.clientX - r.left - ship.x);
    fire();
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
