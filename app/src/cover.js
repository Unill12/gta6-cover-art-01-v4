// Vice Heat Cover Studio — cover renderer.
// Draws a multi-panel GTA-style poster cover onto a canvas: hero pop-out,
// striped chrome title, Vice colour grades, role tags, review strip, billing
// block and seal. Pure canvas 2D, no network, no fonts to download.

export const SIZES = {
  square: { w: 1080, h: 1080, label: '1080 × 1080' },
  portrait: { w: 1080, h: 1350, label: '1080 × 1350' },
  landscape: { w: 1920, h: 1080, label: '1920 × 1080' },
};

export const GRADES = [
  { id: 'sunset', name: 'Sunset', sub: 'orange-pink dusk', sky: ['#ff9a3d', '#ff2e88'], wash: '#ff7a18', washAlpha: 0.16, chrome: ['#fffbe0', '#ffd166', '#ff8c42', '#ffffff'], accent: '#ff2e88', sun: '#ffe9a8' },
  { id: 'neon', name: 'Neon', sub: 'hot pink + cyan', sky: ['#3b0a6e', '#ff2e88'], wash: '#c724ff', washAlpha: 0.18, chrome: ['#e8fbff', '#7df9ff', '#ff2e88', '#ffffff'], accent: '#00e5ff', sun: '#7df9ff' },
  { id: 'vice-pink', name: 'Vice Pink', sub: 'bubblegum poster', sky: ['#ff7eb3', '#b5179e'], wash: '#ff5da2', washAlpha: 0.18, chrome: ['#fff0f6', '#ffb3d9', '#ff2e88', '#ffffff'], accent: '#ffd166', sun: '#fff0f6' },
  { id: 'heatwave', name: 'Heatwave', sub: 'scorched gold', sky: ['#ffb703', '#fb8500'], wash: '#fb8500', washAlpha: 0.20, chrome: ['#fffbe0', '#ffd166', '#fb8500', '#ffffff'], accent: '#d00000', sun: '#fff3b0' },
  { id: 'twilight', name: 'Twilight', sub: 'purple night drive', sky: ['#5a189a', '#10002b'], wash: '#7b2cbf', washAlpha: 0.20, chrome: ['#f3e8ff', '#c77dff', '#7b2cbf', '#ffffff'], accent: '#e0aaff', sun: '#e0aaff' },
  { id: 'gold', name: 'Gold', sub: 'champagne luxe', sky: ['#f4d35e', '#8a5a00'], wash: '#f4d35e', washAlpha: 0.14, chrome: ['#fffbe0', '#f4d35e', '#b98a1d', '#ffffff'], accent: '#8a5a00', sun: '#fffbe0' },
  { id: 'teal-noir', name: 'Teal Noir', sub: 'moody teal night', sky: ['#0f5257', '#081c2c'], wash: '#2a9d8f', washAlpha: 0.18, chrome: ['#e6fffa', '#8ac926', '#2a9d8f', '#ffffff'], accent: '#8ac926', sun: '#caf0f8' },
  { id: 'mono', name: 'Mono', sub: 'black & white print', sky: ['#e9e9e9', '#222222'], wash: '#888888', washAlpha: 0.10, chrome: ['#ffffff', '#d9d9d9', '#555555', '#ffffff'], accent: '#111111', sun: '#ffffff' },
];

// Panel rects are fractions of the panel area. `hero` is the pop-out panel.
export const LAYOUTS = [
  { id: 'hero-left', name: 'Hero Left', sub: 'big hero, 2 side panels', hero: 0,
    panels: [[0, 0, 0.52, 1], [0.52, 0, 0.48, 0.5], [0.52, 0.5, 0.48, 0.5]] },
  { id: 'hero-right', name: 'Hero Right', sub: 'big hero, 2 side panels', hero: 0,
    panels: [[0.48, 0, 0.52, 1], [0, 0, 0.48, 0.5], [0, 0.5, 0.48, 0.5]] },
  { id: 'hero-center', name: 'Hero Center', sub: 'hero flanked by 4 panels', hero: 2,
    panels: [[0, 0, 0.26, 0.5], [0, 0.5, 0.26, 0.5], [0.26, 0, 0.48, 1], [0.74, 0, 0.26, 0.5], [0.74, 0.5, 0.26, 0.5]] },
  { id: 'mosaic', name: 'Mosaic 7', sub: 'seven-panel comic grid', hero: 0,
    panels: [[0, 0, 0.55, 0.62], [0.55, 0, 0.225, 0.31], [0.775, 0, 0.225, 0.31], [0.55, 0.31, 0.225, 0.31], [0.775, 0.31, 0.225, 0.31], [0, 0.62, 0.5, 0.38], [0.5, 0.62, 0.5, 0.38]] },
  { id: 'triptych', name: 'Triptych', sub: 'three tall panels', hero: 1,
    panels: [[0, 0, 0.30, 1], [0.30, 0, 0.40, 1], [0.70, 0, 0.30, 1]] },
  { id: 'quad', name: 'Quad', sub: 'four equal panels', hero: 0,
    panels: [[0, 0, 0.5, 0.5], [0.5, 0, 0.5, 0.5], [0, 0.5, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5]] },
  { id: 'strip', name: 'Strip', sub: 'four vertical strips', hero: 0,
    panels: [[0, 0, 0.40, 1], [0.40, 0, 0.20, 1], [0.60, 0, 0.20, 1], [0.80, 0, 0.20, 1]] },
];

export function layoutById(id) {
  return LAYOUTS.find((l) => l.id === id) || LAYOUTS[0];
}
export function gradeById(id) {
  return GRADES.find((g) => g.id === id) || GRADES[0];
}

export function defaultState() {
  return {
    layout: 'hero-left',
    grade: 'sunset',
    size: 'portrait',
    title: 'VICE HEAT',
    subtitle: 'A LEONIDA STORY',
    quote: 'The best cover maker on the strip.',
    stars: 5,
    billing: 'VICE HEAT PICTURES  •  A LEONIDA PRODUCTION  •  STARRING LUCIA & JASON',
    seal: true,
    popout: true,
    roles: [
      { name: 'LUCIA', role: 'THE DRIVER' },
      { name: 'JASON', role: 'THE FIXER' },
      { name: 'RAFA', role: 'THE LOOKOUT' },
    ],
    panels: [],
  };
}

// Make sure state.panels matches the current layout's panel count.
// Focal point defaults to the upper third of the photo (face-aware).
export function ensurePanels(state) {
  const n = layoutById(state.layout).panels.length;
  while (state.panels.length < n) {
    const i = state.panels.length;
    state.panels.push({ photo: i, fx: 0.5, fy: 0.33, zoom: 1 });
  }
  state.panels.length = n;
  return state;
}

// Panel rectangles in canvas pixels, with gutters between them.
export function panelRects(state, W, H) {
  const m = Math.max(8, Math.round(W * 0.012));
  const g = Math.max(6, Math.round(W * 0.008));
  const area = { x: m, y: Math.round(H * 0.05), w: W - m * 2, h: Math.round(H * 0.71) };
  return layoutById(state.layout).panels.map(([fx, fy, fw, fh]) => ({
    x: area.x + fx * area.w + g / 2,
    y: area.y + fy * area.h + g / 2,
    w: fw * area.w - g,
    h: fh * area.h - g,
  }));
}

export function panelAt(state, W, H, px, py) {
  const rects = panelRects(state, W, H);
  for (let i = rects.length - 1; i >= 0; i--) {
    const r = rects[i];
    if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) return i;
  }
  return -1;
}

function drawPhotoCover(ctx, img, rect, fx, fy, zoom) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;
  const scale = Math.max(rect.w / iw, rect.h / ih) * (zoom || 1);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = rect.x + (rect.w - dw) * fx;
  const dy = rect.y + (rect.h - dh) * fy;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + rr, y + h);
  ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
}

// Chrome lettering: gradient fill, horizontal retro stripes, dark outline.
function drawChromeTitle(ctx, text, cx, topY, fontPx, chrome, W) {
  let px = fontPx;
  const font = (s) => `900 ${Math.round(s)}px "Arial Black", "Archivo Black", Impact, sans-serif`;
  ctx.font = font(px);
  let tw = ctx.measureText(text).width;
  const maxW = W * 0.94;
  if (tw > maxW) { px = Math.floor(px * (maxW / tw)); ctx.font = font(px); tw = ctx.measureText(text).width; }
  const pad = Math.round(px * 0.35);
  const off = document.createElement('canvas');
  off.width = Math.ceil(tw) + pad * 2;
  off.height = Math.ceil(px * 1.5);
  const o = off.getContext('2d');
  o.font = font(px);
  o.textBaseline = 'middle';
  o.textAlign = 'center';
  const grad = o.createLinearGradient(0, 0, 0, off.height);
  grad.addColorStop(0, chrome[0]);
  grad.addColorStop(0.38, chrome[1]);
  grad.addColorStop(0.55, chrome[2]);
  grad.addColorStop(0.75, chrome[3]);
  grad.addColorStop(1, chrome[1]);
  o.fillStyle = grad;
  o.fillText(text, off.width / 2, off.height / 2);
  // Retro horizontal stripes clipped to the letters.
  o.globalCompositeOperation = 'source-atop';
  o.fillStyle = 'rgba(20, 5, 40, 0.30)';
  for (let y = Math.round(px * 0.12); y < off.height; y += Math.max(7, Math.round(px * 0.11))) {
    o.fillRect(0, y, off.width, Math.max(2, Math.round(px * 0.035)));
  }
  o.globalCompositeOperation = 'source-over';
  o.lineWidth = Math.max(2, Math.round(px * 0.045));
  o.strokeStyle = '#160826';
  o.lineJoin = 'round';
  o.strokeText(text, off.width / 2, off.height / 2);
  ctx.save();
  ctx.translate(cx, topY + off.height / 2);
  ctx.rotate(-0.035);
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = Math.round(px * 0.18);
  ctx.shadowOffsetY = Math.round(px * 0.06);
  ctx.drawImage(off, -off.width / 2, -off.height / 2);
  ctx.restore();
}

function drawRoleTags(ctx, roles, cx, y, H) {
  const fs = Math.max(13, Math.round(H * 0.016));
  ctx.font = `800 ${fs}px system-ui, sans-serif`;
  const pills = roles.filter((r) => r.name).map((r) => {
    const label = r.role ? `${r.name} — ${r.role}` : r.name;
    return { label, w: ctx.measureText(label).width + fs * 1.7 };
  });
  const gap = Math.round(H * 0.008);
  const total = pills.reduce((a, p) => a + p.w, 0) + gap * (pills.length - 1);
  let x = cx - total / 2;
  const h = fs * 2.1;
  for (const p of pills) {
    ctx.save();
    ctx.fillStyle = 'rgba(10, 4, 24, 0.82)';
    roundRectPath(ctx, x, y, p.w, h, h / 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 209, 102, 0.9)';
    ctx.lineWidth = Math.max(1.5, H * 0.0016);
    ctx.stroke();
    ctx.fillStyle = '#ffd166';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.label, x + p.w / 2, y + h / 2 + 1);
    ctx.restore();
    x += p.w + gap;
  }
  return y + h;
}

function drawReviewStrip(ctx, quote, stars, W, H, grade) {
  const fs = Math.max(12, Math.round(H * 0.015));
  ctx.font = `700 ${fs}px system-ui, sans-serif`;
  const starText = '★'.repeat(stars) + '☆'.repeat(Math.max(0, 5 - stars));
  const label = `${starText}  “${quote}”`;
  const w = Math.min(W * 0.62, ctx.measureText(label).width + fs * 2.2);
  const h = fs * 2.3;
  const x = W - w - Math.max(10, W * 0.015);
  const y = Math.max(8, H * 0.008);
  ctx.save();
  ctx.fillStyle = 'rgba(10, 4, 24, 0.85)';
  roundRectPath(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.strokeStyle = grade.accent;
  ctx.lineWidth = Math.max(1.5, H * 0.0016);
  ctx.stroke();
  ctx.fillStyle = '#ffd166';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let shown = label;
  while (ctx.measureText(shown).width > w - fs * 1.6 && shown.length > 12) {
    shown = shown.slice(0, -2);
  }
  ctx.fillText(shown, x + w / 2, y + h / 2 + 1);
  ctx.restore();
}

function drawSeal(ctx, cx, cy, r, grade) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.21);
  ctx.fillStyle = 'rgba(10, 4, 24, 0.78)';
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = grade.accent;
  ctx.lineWidth = Math.max(2, r * 0.07);
  ctx.beginPath(); ctx.arc(0, 0, r * 0.86, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#ffd166';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${Math.round(r * 0.34)}px "Arial Black", Impact, sans-serif`;
  ctx.fillText('VICE HEAT', 0, -r * 0.14);
  ctx.font = `700 ${Math.round(r * 0.2)}px system-ui, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('EST. 2026', 0, r * 0.28);
  ctx.restore();
}

// Hero pop-out: the hero photo, enlarged about its focal point, breaking the
// top edge of its frame inside a rounded silhouette with a drop shadow.
function drawHeroPopout(ctx, img, rect, panel, W, H, grade) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;
  const m = Math.max(8, Math.round(W * 0.012));
  const base = Math.max(rect.w / iw, rect.h / ih);
  // Zoom 1.10x about the focal point, so the face stays put while the photo
  // spills past the top edge of its frame. A bottom anchor would show a
  // different part of the photo than the panel underneath it.
  const dw0 = iw * base;
  const dh0 = ih * base;
  const dx0 = rect.x + (rect.w - dw0) * panel.fx;
  const dy0 = rect.y + (rect.h - dh0) * panel.fy;
  const z = 1.10;
  const dw = dw0 * z;
  const dh = dh0 * z;
  const fxC = rect.x + panel.fx * rect.w;
  const fyC = rect.y + panel.fy * rect.h;
  const dx = fxC - (fxC - dx0) * z;
  const dy = fyC - (fyC - dy0) * z;
  const popH = Math.min(Math.max(0, rect.y - dy), rect.y - m * 0.4, H * 0.06);
  if (popH < 4) return;
  const side = Math.min(Math.max(0, (dw - rect.w) / 2), W * 0.02);
  const ox = Math.round(rect.x - side);
  const oy = Math.round(rect.y - popH);
  const ow = Math.round(rect.w + side * 2);
  const oh = Math.round(rect.h + popH);
  const off = document.createElement('canvas');
  off.width = ow; off.height = oh;
  const o = off.getContext('2d');
  o.save();
  // Gently rounded top: the photo breaks the frame by a little, it does not
  // balloon into a dome that hides the face.
  const r = Math.round(ow * 0.10);
  o.beginPath();
  o.moveTo(0, oh);
  o.lineTo(0, r);
  o.quadraticCurveTo(0, 0, r, 0);
  o.lineTo(ow - r, 0);
  o.quadraticCurveTo(ow, 0, ow, r);
  o.lineTo(ow, oh);
  o.closePath();
  o.clip();
  o.drawImage(img, dx - ox, dy - oy, dw, dh);
  o.restore();
  ctx.save();
  ctx.filter = `drop-shadow(0 ${Math.round(H * 0.012)}px ${Math.round(H * 0.014)}px rgba(0,0,0,0.55))`;
  ctx.drawImage(off, ox, oy);
  ctx.restore();
}

function drawPlaceholder(ctx, rect, i) {
  const g = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y + rect.h);
  g.addColorStop(0, '#3b1560');
  g.addColorStop(1, '#12081f');
  ctx.fillStyle = g;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.fillStyle = '#ffd166';
  ctx.font = `800 ${Math.max(14, Math.round(rect.w * 0.07))}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`PANEL ${i + 1}`, rect.x + rect.w / 2, rect.y + rect.h / 2);
}

export function drawCover(ctx, W, H, state, photos) {
  const grade = gradeById(state.grade);
  const m = Math.max(8, Math.round(W * 0.012));
  ensurePanels(state);
  const rects = panelRects(state, W, H);
  const heroIdx = layoutById(state.layout).hero;

  // Sunset sky + low sun behind the panels.
  const sky = ctx.createLinearGradient(0, 0, W * 0.25, H);
  sky.addColorStop(0, grade.sky[0]);
  sky.addColorStop(1, grade.sky[1]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  const sun = ctx.createRadialGradient(W * 0.8, H * 0.07, 4, W * 0.8, H * 0.07, H * 0.22);
  sun.addColorStop(0, grade.sun);
  sun.addColorStop(0.55, grade.sun + '88');
  sun.addColorStop(1, grade.sun + '00');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, W, H * 0.3);

  // Photos in their panels.
  for (let i = 0; i < rects.length; i++) {
    const p = state.panels[i];
    const photo = photos.length ? photos[p.photo % photos.length] : null;
    ctx.save();
    roundRectPath(ctx, rects[i].x, rects[i].y, rects[i].w, rects[i].h, Math.max(4, W * 0.006));
    ctx.clip();
    if (photo && photo.img && photo.img.complete && photo.img.naturalWidth) {
      drawPhotoCover(ctx, photo.img, rects[i], p.fx, p.fy, p.zoom);
    } else {
      drawPlaceholder(ctx, rects[i], i);
    }
    ctx.restore();
    // Thin white frame around each panel.
    ctx.strokeStyle = 'rgba(255,255,255,0.92)';
    ctx.lineWidth = Math.max(2, W * 0.003);
    roundRectPath(ctx, rects[i].x, rects[i].y, rects[i].w, rects[i].h, Math.max(4, W * 0.006));
    ctx.stroke();
  }

  // Vice colour wash + vignette over the panels.
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = grade.washAlpha * 2.2;
  ctx.fillStyle = grade.wash;
  ctx.fillRect(0, 0, W, Math.round(H * 0.78));
  ctx.restore();
  const vig = ctx.createRadialGradient(W / 2, H * 0.38, H * 0.25, W / 2, H * 0.38, H * 0.75);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.34)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // Hero pop-out over the frame.
  if (state.popout) {
    const p = state.panels[heroIdx];
    const photo = photos.length ? photos[p.photo % photos.length] : null;
    if (photo && photo.img && photo.img.complete && photo.img.naturalWidth) {
      drawHeroPopout(ctx, photo.img, rects[heroIdx], p, W, H, grade);
    }
  }

  // Review strip, top right.
  drawReviewStrip(ctx, state.quote || '', state.stars || 5, W, H, grade);

  // Title band: dark gradient, role tags, subtitle, chrome title, billing.
  const bandTop = Math.round(H * 0.76);
  const band = ctx.createLinearGradient(0, bandTop, 0, H);
  band.addColorStop(0, 'rgba(8,2,20,0)');
  band.addColorStop(0.18, 'rgba(8,2,20,0.88)');
  band.addColorStop(1, 'rgba(8,2,20,0.96)');
  ctx.fillStyle = band;
  ctx.fillRect(0, bandTop, W, H - bandTop);

  let y = bandTop + Math.round(H * 0.012);
  y = drawRoleTags(ctx, state.roles, W / 2, y, H);
  const subFs = Math.max(13, Math.round(H * 0.017));
  ctx.font = `700 ${subFs}px system-ui, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  try { ctx.letterSpacing = `${Math.round(subFs * 0.35)}px`; } catch (e) { /* older canvas */ }
  ctx.fillText((state.subtitle || '').toUpperCase(), W / 2, y + subFs + Math.round(H * 0.012));
  try { ctx.letterSpacing = '0px'; } catch (e) { /* older canvas */ }
  const titlePx = Math.min(W * 0.115, H * 0.088);
  drawChromeTitle(ctx, (state.title || 'VICE HEAT').toUpperCase(), W / 2, y + subFs + Math.round(H * 0.028), titlePx, grade.chrome, W);

  // Billing block, tiny condensed type at the very bottom.
  const billFs = Math.max(9, Math.round(H * 0.0115));
  ctx.font = `600 ${billFs}px system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.textAlign = 'center';
  let billing = (state.billing || '').toUpperCase();
  while (ctx.measureText(billing).width > W * 0.86 && billing.length > 20) billing = billing.slice(0, -2);
  ctx.fillText(billing, W / 2, H - Math.round(H * 0.014));

  // Seal stamp, bottom right, clear of the title and billing lines.
  if (state.seal) {
    drawSeal(ctx, W - Math.round(H * 0.04) - m, H - Math.round(H * 0.06), Math.round(H * 0.036), grade);
  }
}

export function renderCover(canvas, state, photos, selectedIdx = -1) {
  const size = SIZES[state.size] || SIZES.portrait;
  canvas.width = size.w;
  canvas.height = size.h;
  const ctx = canvas.getContext('2d');
  drawCover(ctx, size.w, size.h, state, photos);
  if (selectedIdx >= 0) {
    const rects = panelRects(state, size.w, size.h);
    const r = rects[selectedIdx];
    if (r) {
      ctx.save();
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = Math.max(3, size.w * 0.004);
      ctx.setLineDash([18, 12]);
      ctx.strokeRect(r.x - 4, r.y - 4, r.w + 8, r.h + 8);
      ctx.setLineDash([]);
      // Focal-point crosshair.
      const p = state.panels[selectedIdx];
      const fx = r.x + p.fx * r.w;
      const fy = r.y + p.fy * r.h;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(fx, fy, Math.max(10, size.w * 0.012), 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(fx - 22, fy); ctx.lineTo(fx + 22, fy);
      ctx.moveTo(fx, fy - 22); ctx.lineTo(fx, fy + 22);
      ctx.stroke();
      ctx.restore();
    }
  }
  return canvas;
}

// Render an exact-size export PNG off-screen.
export function exportCover(state, photos, sizeId) {
  const size = SIZES[sizeId] || SIZES[state.size] || SIZES.portrait;
  const canvas = document.createElement('canvas');
  canvas.width = size.w;
  canvas.height = size.h;
  drawCover(canvas.getContext('2d'), size.w, size.h, { ...state, size: sizeId }, photos);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('export failed'))), 'image/png');
  });
}
