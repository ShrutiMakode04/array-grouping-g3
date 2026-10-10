const fs = require('fs');
const txt = fs.readFileSync('temp_ref.js', 'utf8');
const regex = /className:"([^"]*phase)"/g;
let m;
const phases = new Set();
while ((m = regex.exec(txt)) !== null) {
  phases.add(m[1]);
}
console.log([...phases]);
