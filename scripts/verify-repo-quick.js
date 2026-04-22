/**
 * Verifikasi cepat tanpa server jalan: syntax server utama + JSON config valid.
 * Jalankan dari root: npm run verify
 * Atau dari server/: npm run verify
 */
/* eslint-disable no-console */
var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var root = path.join(__dirname, '..');
var errors = 0;

var serverFiles = [
  'server/gateway.js',
  'server/agent-autonomy.js',
  'server/agent-capabilities.js',
  'server/agent-ledger.js',
  'server/agent-learning.js',
  'server/agent-personality.js',
  'server/module-registry.js',
  'server/memory-store.js',
  'server/ai-connector.js',
  'server/settings-store.js',
  'server/innovation-agent.js',
  'server/media-tools.js',
  'server/npc-module.js',
  'server/npc-registry.js',
  'server/workflow-engine.js',
  'server/sales-agent.js',
  'server/wa-agent.js',
  'server/autopilot.js'
];

console.log('[verify] node --check …');
for (var i = 0; i < serverFiles.length; i++) {
  var rel = serverFiles[i];
  var abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    console.warn('[verify] skip (missing):', rel);
    continue;
  }
  try {
    cp.execSync('node --check "' + abs.replace(/"/g, '\\"') + '"', { stdio: 'pipe' });
    console.log('  OK', rel);
  } catch (e) {
    console.error('  FAIL', rel);
    errors++;
  }
}

var jsonFiles = ['config/agent-ledger.json'];
for (var j = 0; j < jsonFiles.length; j++) {
  var jp = path.join(root, jsonFiles[j]);
  if (!fs.existsSync(jp)) {
    console.warn('[verify] skip JSON (missing):', jsonFiles[j]);
    continue;
  }
  try {
    JSON.parse(fs.readFileSync(jp, 'utf8'));
    console.log('[verify] JSON OK', jsonFiles[j]);
  } catch (e2) {
    console.error('[verify] JSON FAIL', jsonFiles[j], e2.message);
    errors++;
  }
}

var worldPath = path.join(root, 'config', 'world.json');
if (fs.existsSync(worldPath)) {
  try {
    JSON.parse(fs.readFileSync(worldPath, 'utf8'));
    console.log('[verify] JSON OK config/world.json');
  } catch (e3) {
    console.error('[verify] JSON FAIL config/world.json', e3.message);
    errors++;
  }
} else {
  console.warn('[verify] skip: config/world.json missing');
}

var clientFiles = [
  'src/world/OutdoorWorld.js',
  'src/core/Game3D.js',
  'src/core/Renderer3D.js',
  'src/core/DayNightCycle.js',
  'src/ui/MiniMap.js',
  'src/ui/SidixPanel.js',
];
console.log('[verify] node --check (client 3D) …');
for (var c = 0; c < clientFiles.length; c++) {
  var relC = clientFiles[c];
  var absC = path.join(root, relC);
  if (!fs.existsSync(absC)) {
    console.warn('[verify] skip (missing):', relC);
    continue;
  }
  try {
    cp.execSync('node --check "' + absC.replace(/"/g, '\\"') + '"', { stdio: 'pipe' });
    console.log('  OK', relC);
  } catch (eC) {
    console.error('  FAIL', relC);
    errors++;
  }
}

if (errors > 0) {
  console.error('[verify] Selesai dengan', errors, 'error.');
  process.exit(1);
}
console.log('[verify] Semua lulus.');
