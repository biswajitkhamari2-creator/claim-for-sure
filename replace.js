const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /9439572073/g, to: '9439151934' },
  { from: /94395 72073/g, to: '94391 51934' },
  { from: /9438463174/g, to: '8144503650' },
  { from: /94384 63174/g, to: '81445 03650' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.vercel' && file !== '.git') {
        processDirectory(fullPath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const r of replacements) {
        if (content.match(r.from)) {
          content = content.replace(r.from, r.to);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'frontend'));
processDirectory(path.join(__dirname, 'backend'));
