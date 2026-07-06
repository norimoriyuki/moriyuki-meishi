// ===== meishi3d shared UI =====
const X_URL = 'https://x.com/kushiro_mtg';
const X_HANDLE = '@kushiro_mtg';

const X_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';

const COUNTRIES = [
  ['jp', '日本'],
  ['cn', '中国'],
  ['lk', 'ලංකා'],
  ['mz', 'MOÇ'],
  ['cr', 'CR'],
];

function navHTML(current) {
  const links = COUNTRIES.map(([code, label]) =>
    `<a href="${code}.html" class="${code === current ? 'active' : ''}">${label}</a>`
  ).join('');
  return `<a href="index.html" title="QR">◈</a>${links}`;
}

export function setupUI(cfg) {
  // cfg: { current, nameMain, nameSub, nameExtra?, mainClass?,
  //        titleMain, titleSub, qr: { dark, light, glow } }
  const ui = document.createElement('div');
  ui.className = 'ui';
  ui.innerHTML = `
    <nav class="country-nav">${navHTML(cfg.current)}</nav>
    <div class="name-block">
      <h1 class="name-main ${cfg.mainClass || ''}">${cfg.nameMain}</h1>
      <div class="name-divider"></div>
      <div class="name-sub">${cfg.nameSub}</div>
      ${cfg.nameExtra ? `<div class="name-extra">${cfg.nameExtra}</div>` : ''}
      <div class="title-block">
        <div class="title-line">${cfg.titleMain}</div>
        <div class="title-line">${cfg.titleSub}</div>
      </div>
    </div>
    <div class="bottom">
      <div class="qr-inline" style="--qr-bg:${cfg.qr.light};--qr-glow:${cfg.qr.glow}">
        <canvas class="qr-canvas" width="128" height="128"></canvas>
      </div>
      <a class="x-link" href="${X_URL}" target="_blank" rel="noopener">${X_SVG}${X_HANDLE}</a>
    </div>`;
  document.body.appendChild(ui);

  const canvas = ui.querySelector('.qr-canvas');
  if (window.QRCode) {
    window.QRCode.toCanvas(canvas, X_URL, {
      width: 128, margin: 1,
      color: { dark: cfg.qr.dark, light: cfg.qr.light },
    });
    canvas.style.width = canvas.style.height = '128px';
  }
}

// pointer + gyro parallax; returns state with smoothed x/y in [-1,1]
export function createParallax() {
  const s = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (e) => {
    s.tx = (e.clientX / innerWidth - 0.5) * 2;
    s.ty = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
  addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (!t) return;
    s.tx = (t.clientX / innerWidth - 0.5) * 2;
    s.ty = (t.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
  addEventListener('deviceorientation', (e) => {
    if (e.gamma == null || e.beta == null) return;
    s.tx = Math.max(-1, Math.min(1, e.gamma / 25));
    s.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
  });
  s.update = () => {
    s.x += (s.tx - s.x) * 0.04;
    s.y += (s.ty - s.y) * 0.04;
  };
  return s;
}

// standard renderer + resize wiring
export function createApp(THREE, fov = 55) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  document.getElementById('bg').appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, innerWidth / innerHeight, 0.1, 300);
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  return { renderer, scene, camera };
}

// canvas-texture helper
export function canvasTexture(THREE, size, draw) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 2;
  return tex;
}

// soft radial glow texture
export function glowTexture(THREE, color, inner = 0.0) {
  return canvasTexture(THREE, 128, (ctx, s) => {
    const g = ctx.createRadialGradient(s/2, s/2, s*inner, s/2, s/2, s/2);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}
