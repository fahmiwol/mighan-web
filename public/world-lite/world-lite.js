/*
 * @mighan/world-lite — renderer dunia isometrik "lite" untuk customer.
 *
 * PENTING: file ini SENGAJA tidak tahu apa-apa soal AgentBrain / LLM / ops logic.
 * Ia hanya: (1) render scene dari JSON deklaratif, (2) drag-drop tile, (3) emit event.
 *
 * NPC = model glTF rigged + animasi idle (game NPC beneran), bukan box/billboard.
 * Demo model: three.js RobotExpressive (CC0). Produksi: Quaternius Universal Base
 * Characters (CC0, recolor + part-swap) + Tripo3D (premium custom). RPM sudah mati 2026.
 * Style world disetel mirip ops.mighan.com (isometrik dark-cyberpunk + neon).
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as skeletonClone } from 'three/addons/utils/SkeletonUtils.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const PALETTE = {
  desk: { color: 0x4a7bd8, h: 0.4 }, chair: { color: 0xd85a8a, h: 0.5 },
  plant: { color: 0x3ddc84, h: 0.7 }, board: { color: 0xffc955, h: 0.9 },
  portal: { color: 0x33d6e0, h: 0.6 }, shelf: { color: 0x9a7b4f, h: 1.0 },
};
// model NPC rigged+animasi (CC0/three examples). Ganti ke Quaternius di produksi.
const NPC_MODELS = {
  robot: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r180/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
};

export class WorldLite {
  constructor(container, opts = {}) {
    this.container = container;
    this.mode = opts.mode || 'view';
    this._bloom = opts.bloom === true;   // post-fx bloom opt-in (mahal di low-end; IBL tetap selalu nyala)
    this.tile = 1; this.grid = { w: 12, h: 12 };
    this.objects = []; this.agents = [];
    this.placing = null; this._cbs = {}; this._mixers = []; this._modelCache = {};
    this._clock = new THREE.Clock();
    this._initThree();
    this._raycaster = new THREE.Raycaster();
    window.addEventListener('resize', () => this._resize());
    this._loop();
  }

  on(evt, cb) { (this._cbs[evt] = this._cbs[evt] || []).push(cb); return this; }
  _emit(evt, detail) {
    (this._cbs[evt] || []).forEach((cb) => { try { cb(detail); } catch (e) {} });
    try { window.parent && window.parent.postMessage({ source: 'world-lite', evt, detail }, '*'); } catch (e) {}
  }

  _initThree() {
    const w = this.container.clientWidth || 800, h = this.container.clientHeight || 500;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x08081a);          // dark cyberpunk (match ops)
    this.scene.fog = new THREE.Fog(0x08081a, 22, 46);
    const aspect = w / h, d = 9;
    this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.1, 100);
    this.camera.position.set(12, 12, 12); this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;     // match ops grading
    this.renderer.toneMappingExposure = 1.45;
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false; this.controls.minZoom = 0.5; this.controls.maxZoom = 2.5;
    this.controls.maxPolarAngle = Math.PI / 2.2;
    this.scene.add(new THREE.AmbientLight(0x5566aa, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 1.1); dir.position.set(8, 16, 6); dir.castShadow = true; this.scene.add(dir);
    this.scene.add(this._neon(0x00f5ff, -6, 4, -6));            // cyan neon
    this.scene.add(this._neon(0x9b59b6, 7, 4, 5));              // purple neon
    this.renderer.domElement.addEventListener('click', (e) => this._onClick(e));
    // IBL studio environment → PBR reflections (no external asset)
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.45;
    // post-processing bloom — OPT-IN (opts.bloom). Mahal di low-end/mobile/headless,
    // jadi default OFF; IBL + tone mapping + PBR sudah kasih look pro tanpa ini.
    if (this._bloom) {
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(Math.max(256, (w / 2) | 0), Math.max(256, (h / 2) | 0)), 0.45, 0.6, 0.82));
      this.composer.addPass(new OutputPass());
    }
  }
  _neon(color, x, y, z) { const l = new THREE.PointLight(color, 0.6, 30); l.position.set(x, y, z); return l; }

  _ndc(cx, cy) { const r = this.renderer.domElement.getBoundingClientRect(); return new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1); }
  _tileFromPoint(cx, cy) {
    this._raycaster.setFromCamera(this._ndc(cx, cy), this.camera);
    const hit = this._raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), new THREE.Vector3());
    if (!hit) return null;
    const half = this.grid.w / 2, tx = Math.floor(hit.x + half), ty = Math.floor(hit.z + half);
    if (tx < 0 || ty < 0 || tx >= this.grid.w || ty >= this.grid.h) return null;
    return [tx, ty];
  }
  _world(tile, y = 0) { return new THREE.Vector3(tile[0] - this.grid.w / 2 + 0.5, y, tile[1] - this.grid.h / 2 + 0.5); }

  loadScene(scene) {
    scene = scene || {}; this.grid = scene.grid || this.grid;
    if (scene.theme && scene.theme.bg) { const c = new THREE.Color(scene.theme.bg); this.scene.background = c; if (this.scene.fog) this.scene.fog.color = c; }
    this._buildFloor(scene.theme || {});
    (scene.objects || []).forEach((o) => this.placeObject(o, true));
    (scene.agents || []).forEach((a) => this.placeAgent(a, true));
    this._emit('scene:loaded', { objects: this.objects.length, agents: this.agents.length });
    return this;
  }
  _buildFloor(theme) {
    if (this._floor) this.scene.remove(this._floor);
    const g = new THREE.Group();
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(this.grid.w, this.grid.h), new THREE.MeshStandardMaterial({ color: new THREE.Color(theme.floor || 0x14182a), metalness: 0.35, roughness: 0.55 }));
    plane.rotation.x = -Math.PI / 2; plane.receiveShadow = true; g.add(plane);
    const grid = new THREE.GridHelper(this.grid.w, this.grid.w, 0x00f5ff, 0x222a44); grid.position.y = 0.01; g.add(grid);
    this._floor = g; this.scene.add(g);
  }

  placeObject(o, silent) {
    const def = PALETTE[o.type] || { color: 0x888888, h: 0.5 };
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, def.h, 0.7), new THREE.MeshStandardMaterial({ color: o.color != null ? o.color : def.color, emissive: new THREE.Color(o.color != null ? o.color : def.color).multiplyScalar(0.18), metalness: 0.35, roughness: 0.45 }));
    mesh.position.copy(this._world(o.tile, def.h / 2)); mesh.castShadow = true; mesh.userData = { kind: 'object', ref: o };
    this.scene.add(mesh); this.objects.push({ o, mesh });
    if (!silent) this._emit('place', { kind: 'object', type: o.type, tile: o.tile });
    return mesh;
  }

  // sprite portrait avatar + label nama (melayang di atas model)
  _label(text) {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 64;
    const x = cv.getContext('2d'); x.fillStyle = 'rgba(8,10,26,.8)'; x.fillRect(0, 0, 256, 64);
    x.fillStyle = '#33d6e0'; x.font = 'bold 30px Segoe UI, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text || '', 128, 32);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true })); s.scale.set(1.4, 0.35, 1); return s;
  }

  _loadModel(key) {
    if (this._modelCache[key]) return this._modelCache[key];
    this._modelCache[key] = new Promise((res, rej) => new GLTFLoader().load(NPC_MODELS[key], res, undefined, rej));
    return this._modelCache[key];
  }

  placeAgent(a, silent) {
    const grp = new THREE.Group(); grp.position.copy(this._world(a.tile, 0));
    // base ring (warna identitas agent)
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.06, 24), new THREE.MeshStandardMaterial({ color: a.color != null ? a.color : 0x33d6e0, emissive: new THREE.Color(a.color != null ? a.color : 0x33d6e0).multiplyScalar(0.5) }));
    grp.add(ring);
    // portrait avatar (billboard) + nameplate melayang
    const portrait = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.85), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true }));
    portrait.position.y = 2.0; grp.add(portrait);
    if (a.avatarUrl) new THREE.TextureLoader().load(a.avatarUrl, (t) => { portrait.material.map = t; portrait.material.needsUpdate = true; });
    const label = this._label(a.name || ''); label.position.y = 2.7; grp.add(label);
    grp.userData = { kind: 'agent', ref: a, billboard: portrait, label };
    this.scene.add(grp); this.agents.push({ a, grp });

    // load model rigged + animasi idle (async; ring/portrait tampil dulu)
    this._loadModel('robot').then((g) => {
      const model = skeletonClone(g.scene); model.scale.setScalar(0.6); model.position.y = 0.05;
      model.traverse((m) => { if (m.isMesh) { m.castShadow = true; if (m.material && m.material.emissive) m.material.emissive = new THREE.Color(a.color != null ? a.color : 0x33d6e0).multiplyScalar(0.12); } });
      grp.add(model); grp.userData.model = model;
      const mixer = new THREE.AnimationMixer(model);
      const idle = g.animations.find((c) => /idle/i.test(c.name)) || g.animations[0];
      if (idle) mixer.clipAction(idle).play();
      this._mixers.push(mixer); grp.userData.mixer = mixer;
    }).catch(() => {/* fallback: ring + portrait saja */});

    if (!silent) this._emit('place', { kind: 'agent', id: a.id, tile: a.tile });
    return grp;
  }

  // ── hire / customize ──
  startPlacing(p) { this.placing = p; this.renderer.domElement.style.cursor = 'copy'; }
  cancelPlacing() { this.placing = null; this.renderer.domElement.style.cursor = ''; }
  getAgent(id) { return this.agents.find((x) => x.a.id === id); }
  updateAgent(id, patch) { const e = this.getAgent(id); if (e) { Object.assign(e.a, patch); if (patch.name && e.grp.userData.label) { e.grp.remove(e.grp.userData.label); const l = this._label(patch.name); l.position.y = 2.7; e.grp.add(l); e.grp.userData.label = l; } this._emit('agent:update', { id, patch }); } }
  updateAgentAvatar(id, url) { const e = this.getAgent(id); if (!e) return; new THREE.TextureLoader().load(url, (t) => { const bb = e.grp.userData.billboard; bb.material.map = t; bb.material.needsUpdate = true; }); e.a.avatarUrl = url; }
  removeAgent(id) { const e = this.getAgent(id); if (!e) return; if (e.grp.userData.mixer) this._mixers = this._mixers.filter((m) => m !== e.grp.userData.mixer); this.scene.remove(e.grp); this.agents = this.agents.filter((x) => x.a.id !== id); this._emit('agent:remove', { id }); }

  dropAt(cx, cy, payload) {
    if (this.mode !== 'build') return;
    const tile = this._tileFromPoint(cx, cy); if (!tile) return;
    if (payload.kind === 'agent') this.placeAgent({ id: payload.id || ('npc-' + Date.now().toString(36)), name: payload.name, tile, avatarUrl: payload.avatarUrl, color: payload.color, role: payload.role, persona: payload.persona, controllerModel: payload.controllerModel, executorModel: payload.executorModel, tools: payload.tools });
    else this.placeObject({ type: payload.type, tile, color: payload.color });
  }

  _onClick(e) {
    if (this.placing) {
      const tile = this._tileFromPoint(e.clientX, e.clientY);
      if (tile) { const p = this.placing; if (p.kind === 'agent') this.placeAgent({ id: p.id || ('npc-' + Date.now().toString(36)), name: p.name, tile, avatarUrl: p.avatarUrl, color: p.color, role: p.role, persona: p.persona, controllerModel: p.controllerModel, executorModel: p.executorModel, tools: p.tools }); else this.placeObject({ type: p.type, tile, color: p.color }); }
      this.cancelPlacing(); return;
    }
    this._raycaster.setFromCamera(this._ndc(e.clientX, e.clientY), this.camera);
    const hits = this._raycaster.intersectObjects(this.scene.children, true);
    for (const h of hits) {
      let o = h.object; while (o && !o.userData.kind) o = o.parent;
      if (o && o.userData.kind === 'agent') { this._emit('agent:click', { id: o.userData.ref.id, name: o.userData.ref.name }); return; }
      if (o && o.userData.kind === 'object') { this._emit('object:click', { type: o.userData.ref.type, tile: o.userData.ref.tile }); return; }
    }
  }

  toJSON() { return { grid: this.grid, objects: this.objects.map((x) => x.o), agents: this.agents.map((x) => x.a) }; }
  _resize() { const w = this.container.clientWidth, h = this.container.clientHeight, aspect = w / h, d = 9; this.camera.left = -d * aspect; this.camera.right = d * aspect; this.camera.top = d; this.camera.bottom = -d; this.camera.updateProjectionMatrix(); this.renderer.setSize(w, h); if (this.composer) this.composer.setSize(w, h); }
  _loop() {
    requestAnimationFrame(() => this._loop());
    const dt = this._clock.getDelta(); this._mixers.forEach((m) => m.update(dt));
    this.agents.forEach((x) => { if (x.grp.userData.billboard) x.grp.userData.billboard.quaternion.copy(this.camera.quaternion); if (x.grp.userData.label) x.grp.userData.label.quaternion.copy(this.camera.quaternion); });
    this.controls.update();
    if (this.composer) this.composer.render(); else this.renderer.render(this.scene, this.camera);
  }
}
