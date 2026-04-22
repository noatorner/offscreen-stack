// watch-and-push.js
// Vigila content.js y hace commit+push automático cuando lo guardas.
// Ejecución: node watch-and-push.js

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FILE  = path.join(__dirname, 'content.js');
const DELAY = 1500; // ms de espera tras el último guardado

let timer = null;

console.log('👀 Vigilando content.js — guarda el archivo para publicar cambios.');
console.log('   (Ctrl+C para parar)\n');

fs.watch(FILE, () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      execSync('git add content.js', { cwd: __dirname, stdio: 'inherit' });
      execSync('git commit -m "update: content texts"', { cwd: __dirname, stdio: 'inherit' });
      execSync('git push', { cwd: __dirname, stdio: 'inherit' });
      console.log('\n✅ Publicado en Vercel — ' + new Date().toLocaleTimeString());
    } catch (e) {
      // Si no hay cambios git devuelve error, es normal
      if (e.message.includes('nothing to commit')) {
        console.log('ℹ️  Sin cambios nuevos.');
      } else {
        console.error('❌ Error:', e.message);
      }
    }
    console.log('\n👀 Siguiendo en espera...\n');
  }, DELAY);
});
