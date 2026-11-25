const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = path.resolve(__dirname, '..');
const tempDir = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'insa-pkg-temp');
const targetZip1 = 'C:\\Users\\Muhammadbilol\\Downloads\\insa-education.zip';
const targetZip2 = 'C:\\Users\\Muhammadbilol\\Desktop\\insa-education.zip';
const targetZip3 = path.join(sourceDir, 'insa-education.zip');

console.log('Packaging INSA Education clean project...');

// Remove old zip files if present
[targetZip1, targetZip2, targetZip3].forEach(p => {
  if (fs.existsSync(p)) fs.unlinkSync(p);
});

// Prepare temp dir
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'insa-education.zip') {
      continue;
    }

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(sourceDir, tempDir);
console.log('Files staged cleanly without node_modules/.next.');

// Use PowerShell Compress-Archive
const psCmd = `powershell -NoProfile -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${targetZip1}' -Force; Copy-Item '${targetZip1}' '${targetZip2}' -Force; Copy-Item '${targetZip1}' '${targetZip3}' -Force"`;
execSync(psCmd, { stdio: 'inherit' });

console.log('ZIP archives created successfully:');
console.log('1. ', targetZip1);
console.log('2. ', targetZip2);
console.log('3. ', targetZip3);

// Clean up tempDir
fs.rmSync(tempDir, { recursive: true, force: true });
console.log('Cleanup completed.');
