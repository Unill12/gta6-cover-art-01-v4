// Vice Heat Cover Studio — editor wiring.
// Loads sample + uploaded photos, builds the control panels, renders the live
// preview, lets the user pick a panel and drag its focal point, and exports
// exact-size PNGs. A `?shot=` query sets up a fixed scene for screenshots.

import {
  SIZES, GRADES, LAYOUTS, layoutById, gradeById,
  defaultState, ensurePanels, panelRects, panelAt,
  renderCover, exportCover,
} from './cover.js';

const SAMPLES = [
  { name: 'Lucia', src: 'samples/lucia.jpg' },
  { name: 'Jason', src: 'samples/jason.jpg' },
  { name: 'Boulevard', src: 'samples/boulevard.jpg' },
  { name: 'Pier', src: 'samples/pier.jpg' },
];

const state = defaultState();
let photos = []; // { name, img }
let selected = 0;
let drag = null;

const $ = (id) => document.getElementById(id);
const canvas = $('preview');
const params = new URLSearchParams(location.search);

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('cannot load ' + src));
    img.src = src;
  });
}

async function loadSamples() {
  const loaded = [];
  for (const s of SAMPLES) {
    try {
      loaded.push({ name: s.name, img: await loadImage(s.src) });
    } catch (e) { /* a missing sample just skips */ }
  }
  return loaded;
}

function redraw() {
  ensurePanels(state);
  renderCover(canvas, state, photos, selected);
  refreshPanelInfo();
}

function refreshPhotoStrip() {
  const strip = $('photoStrip');
  strip.innerHTML = '';
  photos.forEach((p, i) => {
    const img = document.createElement('img');
    img.src = p.img.src;
    img.alt = p.name;
    img.title = p.name;
    if (state.panels[selected] && state.panels[selected].photo === i) img.classList.add('active');
    if (state.panels.some((pan) => pan.photo === i)) img.classList.add('assigned');
    img.addEventListener('click', () => {
      ensurePanels(state);
      state.panels[selected].photo = i;
      redraw();
      refreshPhotoStrip();
    });
    strip.appendChild(img);
  });
}

function refreshPanelInfo() {
  const info = $('panelInfo');
  const p = state.panels[selected];
  if (!p) { info.textContent = 'No panel selected — click a panel in the preview.'; return; }
  const photo = photos[p.photo % photos.length];
  info.textContent = `Panel ${selected + 1} of ${state.panels.length} — photo: ${photo ? photo.name : 'none'} · focal ${Math.round(p.fx * 100)}% / ${Math.round(p.fy * 100)}% · zoom ${p.zoom.toFixed(2)}×`;
  const zoom = $('zoomInput');
  if (document.activeElement !== zoom) zoom.value = String(p.zoom);
}

function buildLayoutButtons() {
  const wrap = $('layoutBtns');
  for (const l of LAYOUTS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick-btn' + (state.layout === l.id ? ' active' : '');
    b.innerHTML = '';
    const name = document.createElement('span');
    name.textContent = l.name;
    const sub = document.createElement('small');
    sub.textContent = l.sub;
    b.append(name, sub);
    b.addEventListener('click', () => {
      state.layout = l.id;
      selected = layoutById(l.id).hero;
      wrap.querySelectorAll('.pick-btn').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      redraw();
    });
    wrap.appendChild(b);
  }
}

function buildGradeButtons() {
  const wrap = $('gradeBtns');
  for (const g of GRADES) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick-btn' + (state.grade === g.id ? ' active' : '');
    const sw = document.createElement('span');
    sw.className = 'swatch';
    sw.style.background = `linear-gradient(90deg, ${g.sky[0]}, ${g.sky[1]})`;
    const name = document.createElement('span');
    name.textContent = g.name;
    const sub = document.createElement('small');
    sub.textContent = g.sub;
    b.append(sw, name, sub);
    b.addEventListener('click', () => {
      state.grade = g.id;
      wrap.querySelectorAll('.pick-btn').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      redraw();
    });
    wrap.appendChild(b);
  }
}

function buildRoleRows() {
  const wrap = $('roleRows');
  wrap.innerHTML = '';
  state.roles.forEach((role, i) => {
    const row = document.createElement('div');
    row.className = 'role-row';
    const name = document.createElement('input');
    name.type = 'text';
    name.value = role.name;
    name.maxLength = 14;
    name.placeholder = 'NAME';
    name.setAttribute('aria-label', `Cast name ${i + 1}`);
    const job = document.createElement('input');
    job.type = 'text';
    job.value = role.role;
    job.maxLength = 20;
    job.placeholder = 'ROLE';
    job.setAttribute('aria-label', `Cast role ${i + 1}`);
    name.addEventListener('input', () => { role.name = name.value.toUpperCase(); redraw(); });
    job.addEventListener('input', () => { role.role = job.value.toUpperCase(); redraw(); });
    row.append(name, job);
    wrap.appendChild(row);
  });
}

function bindTextControls() {
  $('titleInput').addEventListener('input', (e) => { state.title = e.target.value; redraw(); });
  $('subtitleInput').addEventListener('input', (e) => { state.subtitle = e.target.value; redraw(); });
  $('quoteInput').addEventListener('input', (e) => { state.quote = e.target.value; redraw(); });
  $('starsInput').addEventListener('change', (e) => { state.stars = Number(e.target.value); redraw(); });
  $('billingInput').addEventListener('input', (e) => { state.billing = e.target.value; redraw(); });
  $('sealInput').addEventListener('change', (e) => { state.seal = e.target.checked; redraw(); });
  $('popInput').addEventListener('change', (e) => { state.popout = e.target.checked; redraw(); });
  $('zoomInput').addEventListener('input', (e) => {
    ensurePanels(state);
    state.panels[selected].zoom = Number(e.target.value);
    redraw();
  });
  $('prevPhotoBtn').addEventListener('click', () => cyclePhoto(-1));
  $('nextPhotoBtn').addEventListener('click', () => cyclePhoto(1));
}

function cyclePhoto(dir) {
  if (!photos.length) return;
  ensurePanels(state);
  const p = state.panels[selected];
  p.photo = (((p.photo + dir) % photos.length) + photos.length) % photos.length;
  redraw();
  refreshPhotoStrip();
}

function bindSizeTabs() {
  document.querySelectorAll('.size-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      state.size = tab.dataset.size;
      document.querySelectorAll('.size-tab').forEach((x) => x.classList.remove('active'));
      tab.classList.add('active');
      $('exportSizeLabel').textContent = SIZES[state.size].label;
      redraw();
    });
  });
}

function bindUpload() {
  $('fileInput').addEventListener('change', async (e) => {
    const files = [...e.target.files];
    for (const f of files) {
      try {
        const url = URL.createObjectURL(f);
        const img = await loadImage(url);
        photos.push({ name: f.name.replace(/\.[^.]+$/, ''), img });
      } catch (err) { /* skip unreadable files */ }
    }
    e.target.value = '';
    refreshPhotoStrip();
    redraw();
  });
  $('onePhotoBtn').addEventListener('click', () => {
    ensurePanels(state);
    const first = state.panels[0] ? state.panels[0].photo : 0;
    state.panels.forEach((p) => { p.photo = first; });
    redraw();
    refreshPhotoStrip();
  });
  $('shuffleBtn').addEventListener('click', () => {
    ensurePanels(state);
    state.panels.forEach((p) => { p.photo = Math.floor(Math.random() * photos.length); });
    redraw();
    refreshPhotoStrip();
  });
}

function bindCanvas() {
  const toCover = (e) => {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * canvas.width,
      y: ((e.clientY - r.top) / r.height) * canvas.height,
    };
  };
  canvas.addEventListener('pointerdown', (e) => {
    const pt = toCover(e);
    const hit = panelAt(state, canvas.width, canvas.height, pt.x, pt.y);
    if (hit < 0) return;
    selected = hit;
    const rects = panelRects(state, canvas.width, canvas.height);
    drag = { panel: hit, rect: rects[hit], start: pt, fx0: state.panels[hit].fx, fy0: state.panels[hit].fy };
    canvas.setPointerCapture(e.pointerId);
    redraw();
    refreshPhotoStrip();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const pt = toCover(e);
    const p = state.panels[drag.panel];
    const r = drag.rect;
    p.fx = Math.min(1, Math.max(0, drag.fx0 + (pt.x - drag.start.x) / Math.max(1, (r.w - 1))));
    p.fy = Math.min(1, Math.max(0, drag.fy0 + (pt.y - drag.start.y) / Math.max(1, (r.h - 1))));
    redraw();
  });
  const endDrag = () => { drag = null; };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
}

function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

function bindExport() {
  $('exportBtn').addEventListener('click', async () => {
    const status = $('exportStatus');
    status.textContent = 'Rendering…';
    try {
      const blob = await exportCover(state, photos, state.size);
      const size = SIZES[state.size];
      downloadBlob(blob, `vice-heat-cover-${size.w}x${size.h}.png`);
      status.textContent = `Saved PNG ${size.label} — ${(blob.size / 1024).toFixed(0)} KiB`;
    } catch (e) {
      status.textContent = 'Export failed — try again.';
    }
  });
  $('exportAllBtn').addEventListener('click', async () => {
    const status = $('exportStatus');
    status.textContent = 'Rendering 3 sizes…';
    for (const id of ['square', 'portrait', 'landscape']) {
      const blob = await exportCover(state, photos, id);
      const size = SIZES[id];
      downloadBlob(blob, `vice-heat-cover-${size.w}x${size.h}.png`);
    }
    status.textContent = 'Saved all 3 sizes.';
  });
}

// Deterministic screenshot scenes: fixed layout, grade, caption and photo.
const SHOT_PRESETS = {
  cover: { size: 'landscape', layout: 'hero-left', grade: 'sunset', title: 'VICE HEAT', subtitle: 'A LEONIDA STORY', photo: 0 },
  portrait: { size: 'portrait', layout: 'mosaic', grade: 'vice-pink', title: 'VICE HEAT', subtitle: 'SEVEN WAYS TO STEAL THE CITY', photo: 1 },
  square: { size: 'square', layout: 'hero-right', grade: 'heatwave', title: 'VICE HEAT', subtitle: 'A LEONIDA STORY', photo: 0 },
  editor: { size: 'portrait', layout: 'hero-center', grade: 'neon', title: 'VICE HEAT', subtitle: 'A LEONIDA STORY', photo: 0 },
};

function applyShot(name) {
  const preset = SHOT_PRESETS[name];
  if (!preset) return false;
  state.size = preset.size;
  state.layout = preset.layout;
  state.grade = preset.grade;
  state.title = preset.title;
  state.subtitle = preset.subtitle;
  const photoParam = params.get('photo');
  const photoIdx = photoParam ? SAMPLES.findIndex((s) => s.src.includes(photoParam)) : preset.photo;
  ensurePanels(state);
  state.panels.forEach((p, i) => { p.photo = (photoIdx + i) % photos.length; });
  state.panels[layoutById(state.layout).hero].photo = photoIdx;
  selected = layoutById(state.layout).hero;
  // Cover shots must show the clean exported cover: no selection outline,
  // no focal crosshair. The editor shot keeps the selection visible.
  if (name !== 'editor') selected = -1;
  const caption = params.get('caption');
  if (caption) state.title = caption;
  const layoutParam = params.get('layout');
  if (layoutParam && LAYOUTS.some((l) => l.id === layoutParam)) state.layout = layoutParam;
  const gradeParam = params.get('grade');
  if (gradeParam && GRADES.some((g) => g.id === gradeParam)) state.grade = gradeParam;
  return true;
}

async function init() {
  photos = await loadSamples();
  ensurePanels(state);
  selected = layoutById(state.layout).hero;
  buildLayoutButtons();
  buildGradeButtons();
  buildRoleRows();
  bindTextControls();
  bindSizeTabs();
  bindUpload();
  bindCanvas();
  bindExport();
  const shot = params.get('shot');
  if (shot && applyShot(shot)) {
    // Cover shots show only the cover, full-bleed; the editor shot keeps the UI.
    if (shot !== 'editor') document.body.classList.add('shot-cover');
    else document.body.classList.add('shot-editor');
    $('titleInput').value = state.title;
    $('subtitleInput').value = state.subtitle;
    document.querySelectorAll('.size-tab').forEach((x) => x.classList.toggle('active', x.dataset.size === state.size));
    $('exportSizeLabel').textContent = SIZES[state.size].label;
    document.querySelectorAll('#layoutBtns .pick-btn').forEach((x, i) => x.classList.toggle('active', LAYOUTS[i].id === state.layout));
    document.querySelectorAll('#gradeBtns .pick-btn').forEach((x, i) => x.classList.toggle('active', GRADES[i].id === state.grade));
  }
  redraw();
  refreshPhotoStrip();
  document.title = `Vice Heat Cover Studio — ${state.title}`;
}

init();
