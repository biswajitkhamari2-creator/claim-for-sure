const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Current working directory:', process.cwd());

if (fs.existsSync('frontend') && fs.lstatSync('frontend').isDirectory()) {
  console.log('Changing directory to frontend...');
  process.chdir('frontend');
}

console.log('Installing dependencies in frontend...');
execSync('npm install --no-audit --no-fund', { stdio: 'inherit' });

console.log('Running npm run build...');
execSync('npm run build', { stdio: 'inherit' });

if (fs.existsSync('.output/public')) {
  console.log('Copying .output/public to dist...');
  fs.cpSync('.output/public', 'dist', { recursive: true });
  try {
    fs.cpSync('.output/public', '../dist', { recursive: true });
  } catch (e) {
    // Ignore root copy error if at root
  }
}
console.log('Build completed successfully!');
