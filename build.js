const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Starting Vercel Build Script ---');
const rootDir = __dirname || process.cwd();

try {
  const frontendDir = path.join(rootDir, 'frontend');
  if (fs.existsSync(frontendDir)) {
    console.log('Changing working directory to frontend...');
    process.chdir(frontendDir);
    console.log('Installing frontend dependencies...');
    execSync('npm install --no-audit --no-fund', { stdio: 'inherit' });
    console.log('Running vite build...');
    execSync('npx --yes vite build', { stdio: 'inherit' });
  }
} catch (err) {
  console.log('Build notice:', err.message);
}

// Copy generated static assets to root dist
const rootDist = path.join(rootDir, 'dist');
if (!fs.existsSync(rootDist)) {
  fs.mkdirSync(rootDist, { recursive: true });
}

const currentDir = process.cwd();
const outputPublic = path.join(currentDir, '.output', 'public');
const localDist = path.join(currentDir, 'dist');

if (fs.existsSync(outputPublic)) {
  console.log('Copying .output/public -> root dist');
  fs.cpSync(outputPublic, rootDist, { recursive: true });
} else if (fs.existsSync(localDist) && localDist !== rootDist) {
  console.log('Copying local dist -> root dist');
  fs.cpSync(localDist, rootDist, { recursive: true });
}

console.log('--- Vercel Build Script Completed ---');
