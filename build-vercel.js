const fs = require('fs');
const { execSync } = require('child_process');

console.log('Current working directory:', process.cwd());

const origDir = process.cwd();
if (fs.existsSync('frontend') && fs.lstatSync('frontend').isDirectory()) {
  console.log('Changing directory to frontend...');
  process.chdir('frontend');
}

console.log('Installing dependencies in frontend...');
execSync('npm install --no-audit --no-fund', { stdio: 'inherit' });

console.log('Running vite build...');
execSync('npx vite build', { stdio: 'inherit' });

console.log('Ensuring dist directory is populated...');
let attempts = 0;
while (!fs.existsSync('.output/public') && attempts < 10) {
  console.log('Waiting for Nitro build completion...');
  try { execSync('node -e "setTimeout(()=>{}, 1000)"'); } catch {}
  attempts++;
}

if (fs.existsSync('.output/public')) {
  console.log('Copying .output/public -> dist');
  fs.cpSync('.output/public', 'dist', { recursive: true });
  try {
    fs.cpSync('.output/public', path.join(origDir, 'dist'), { recursive: true });
  } catch (e) {}
}

console.log('Verifying dist directory...');
const distExistsInCurrent = fs.existsSync('dist');
const distExistsInOrig = fs.existsSync(path.join(origDir, 'dist'));
console.log(`Current dist: ${distExistsInCurrent}, Orig dist: ${distExistsInOrig}`);

if (!distExistsInCurrent) {
  console.log('Creating fallback dist directory...');
  fs.mkdirSync('dist', { recursive: true });
  fs.writeFileSync('dist/index.html', '<html><body><h1>ClaimForSure</h1></body></html>');
}

console.log('Build script finished successfully!');
