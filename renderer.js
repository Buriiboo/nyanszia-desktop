// renderer.js — Nyanszia Desktop (Electron) — princess edition 💖

// ---------- Diagnostics ----------
window.addEventListener('error', (e) => {
  console.error('[Nyanszia][window.error]', e.message, e.error);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('[Nyanszia][promise]', e.reason);
});

// Preload bridge sanity
console.log('bridge test:', window.nyanszia?.ping?.());

// ---------- Canvas / WebGL ----------
const canvas = document.getElementById('live2d');
const gl = canvas.getContext('webgl', {
  alpha: true,
  premultipliedAlpha: true,
  antialias: true,
});
if (!gl) console.error('[Nyanszia] WebGL context failed to init.');

// HiDPI crispness
function fitCanvasToCSSPixels() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  }
}
fitCanvasToCSSPixels();
window.addEventListener('resize', fitCanvasToCSSPixels);

// Prove WebGL is alive
gl.clearColor(0.05, 0.05, 0.06, 0.6);
gl.clear(gl.COLOR_BUFFER_BIT);
console.log('[Nyanszia] WebGL clear OK');

// ---------- Pointer tracking ----------
const pointer = { x: 0, y: 0, has: false };
canvas.addEventListener('pointermove', (e) => {
  const r = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  pointer.y = ((e.clientY - r.top) / r.height) * -2 + 1;
  pointer.has = true;
});
canvas.addEventListener('pointerleave', () => (pointer.has = false));

// ---------- Buttons ----------
document.getElementById('btnIdle')?.addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('nyanszia:motion', { detail: { id: 'idle' } }));
});
document.getElementById('btnWave')?.addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('nyanszia:motion', { detail: { id: 'wave' } }));
});
document.getElementById('btnHide')?.addEventListener('click', () => {
  document.querySelector('.root').style.display = 'none';
});

// ---------- Model path ----------
const MODEL_JSON = 'assets/nyanszia_model/Nyanszia.model3.json';

// ---------- Helpers ----------
async function fetchArrayBuffer(url) {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
  return r.arrayBuffer();
}
function loadImage(url) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error('img fail ' + url));
    img.src = url + (url.includes('?') ? '&' : '?') + 't=' + Date.now();
  });
}
async function loadGLTexture(url) {
  const img = await loadImage(url);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}

// ---------- Cubism boot + model load ----------
(async function bootCubism() {
  // Ensure Core + Framework, then return the framework namespace object
  function ensureCubismNamespace() {
    const Core = window.Live2DCubismCore;
    const NS = window.Live2DCubismFramework; // UMD namespace from the framework bundle
    if (!Core || !NS) {
      console.error('[Nyanszia] Cubism not loaded. Core?', !!Core, 'NS?', !!NS);
      return null;
    }
    const CF = NS.CubismFramework;
    const OptCtor = NS.Option || NS.csmOption;
    if (CF && !CF.isStarted && CF.startUp) {
      const opt = OptCtor ? new OptCtor() : undefined;
      if (opt && 'logFunction' in opt) opt.logFunction = (m) => console.log('[Cubism]', m);
      CF.startUp(opt);
    }
    if (CF && !CF.isInitialized && CF.initialize) CF.initialize();
    return NS;
  }

  const NS = ensureCubismNamespace();
  if (!NS) return;

  // Pull classes from the namespace (v5 style)
  const CubismMoc = NS.CubismMoc;
  const CubismModel = NS.CubismModel;
  const CubismRenderer_WebGL = NS.CubismRenderer_WebGL;

  if (!CubismMoc || !CubismModel || !CubismRenderer_WebGL) {
    console.error('[Nyanszia] Cubism classes missing:', {
      CubismMoc, CubismModel, CubismRenderer_WebGL
    });
    return;
  }

  // 1) Load model3.json
  const modelJson = await (await fetch(MODEL_JSON, { cache: 'no-store' })).json();
  console.log('[Nyanszia] model3.json loaded keys:', Object.keys(modelJson));
  const base = MODEL_JSON.replace(/[^\/\\]+$/, '');

  // 2) Resolve moc path
  const mocFile = modelJson.FileReferences.Moc || modelJson.FileReferences.Moc3;
  const mocPath = base + mocFile;
  console.log('[Nyanszia] mocPath:', mocPath);

  // 3) Create moc + model
  const mocArrayBuffer = await fetchArrayBuffer(mocPath);
  const moc = CubismMoc.create(mocArrayBuffer);
  if (!moc) { console.error('[Nyanszia] Failed to create CubismMoc'); return; }
  const model = CubismModel.create(moc);
  if (!model) { console.error('[Nyanszia] Failed to create CubismModel'); return; }

  // 4) Renderer
  const renderer = CubismRenderer_WebGL.create();
  renderer.initialize(gl);
  renderer.setModel(model);
  renderer.setIsPremultipliedAlpha(true);

  // 5) Textures (add 'textures/' if JSON omitted folder)
  const texturesFromJson = modelJson.FileReferences.Textures || [];
  const texPaths = texturesFromJson.map((t) => base + (/[\/\\]/.test(t) ? t : `textures/${t}`));
  console.log('[Nyanszia] texture paths:', texPaths);

  const textures = await Promise.all(texPaths.map((p) => loadGLTexture(p)));
  for (let i = 0; i < textures.length; i++) renderer.bindTexture(i, textures[i]);

  // 6) Viewport / MVP
  function applyViewport() {
    renderer.setViewport(canvas.width, canvas.height);
    const scale = Math.min(canvas.width, canvas.height) / Math.max(canvas.width, canvas.height);
    const mvp = new Float32Array([
      scale, 0,     0, 0,
      0,     scale, 0, 0,
      0,     0,     1, 0,
      0,     0,     0, 1,
    ]);
    renderer.setMvpMatrix(mvp);
  }
  applyViewport();
  window.addEventListener('resize', applyViewport);

  // 7) Render loop + gentle pointer follow
  let last = performance.now();
  function frame(t) {
    const dt = Math.max(0, (t - last) / 1000); last = t;

    if (pointer.has) {
      model.addParameterValueById('ParamAngleX', pointer.x * 30 * dt * 15);
      model.addParameterValueById('ParamAngleY', pointer.y * 30 * dt * 15);
      model.addParameterValueById('ParamEyeBallX', pointer.x * 1.0 * dt * 15);
      model.addParameterValueById('ParamEyeBallY', pointer.y * 1.0 * dt * 15);
    }

    model.update();
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    renderer.drawModel();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // 8) Minimal motions (stub: replace groups with your model’s)
  const motions = modelJson.FileReferences.Motions || {};
  async function playFirst(groupName) {
    const list = motions[groupName];
    if (!list || !list.length) { console.warn('[Nyanszia] no motions in group', groupName); return; }
    const motionPath = base + list[0].File;
    const ab = await fetchArrayBuffer(motionPath);
    const motion = NS.CubismMotion.create(ab);
    if (motion?.setFadeInTime) motion.setFadeInTime(0.25);
    if (motion?.setFadeOutTime) motion.setFadeOutTime(0.25);
    // For now: give a visual cue (proper queue manager can be added later)
    model.addParameterValueById('ParamAngleZ', 18);
  }

  window.addEventListener('nyanszia:motion', (e) => {
    const id = e.detail?.id;
    if (id === 'idle') playFirst('Idle');     // change to your groups
    if (id === 'wave') playFirst('TapBody');  // change to your groups
  });

  console.log('[Nyanszia] Cubism boot complete ✅');
})().catch((err) => console.error('[Nyanszia] boot error', err));
