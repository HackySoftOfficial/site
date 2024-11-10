import fs from 'fs';
import path from 'path';

const sourceDir = path.join(process.cwd(), 'node_modules/@wllama/wllama');
const targetDir = path.join(process.cwd(), 'public/wllama');

function copyDir(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isFile() && 
        !entry.name.endsWith('.ts') && 
        !entry.name.endsWith('.map') &&
        !entry.name.endsWith('.tsbuildinfo')) {
      fs.copyFileSync(srcPath, destPath);
    } else if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    }
  }
}

try {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const esmSourceDir = path.join(sourceDir, 'dist');
  const esmTargetDir = path.join(targetDir, 'esm');
  copyDir(esmSourceDir, esmTargetDir);
  
  console.log('Successfully copied wllama files to public directory');
} catch (error) {
  console.error('Failed to copy wllama files:', error);
  process.exit(1);
} 