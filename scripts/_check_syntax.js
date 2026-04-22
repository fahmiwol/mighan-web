var cp = require('child_process');
var files = [
  'server/workflow-engine.js',
  'server/gateway.js',
  'src/ui/WorkflowEditor.js',
  'src/world/OutdoorWorld.js',
  'src/main.js'
];
var path = require('path');
var root = path.join(__dirname, '..');
var errors = 0;
files.forEach(function(f) {
  var abs = path.join(root, f);
  try {
    var out = cp.execSync('node --check "' + abs + '"', { encoding: 'utf8', stdio: ['pipe','pipe','pipe'] });
    process.stdout.write('OK  ' + f + '\n');
  } catch(e) {
    process.stdout.write('FAIL ' + f + '\n' + (e.stderr || e.stdout || e.message) + '\n');
    errors++;
  }
});
process.stdout.write(errors ? ('TOTAL ERRORS: ' + errors + '\n') : 'ALL PASSED\n');
process.exit(errors ? 1 : 0);
