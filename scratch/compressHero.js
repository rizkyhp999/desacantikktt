const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const inputPath = path.join(__dirname, '../public/foto-kegiatan/hero.JPG');
const outputPath = path.join(__dirname, '../public/foto-kegiatan/hero_min.jpg');

const stats = fs.statSync(inputPath);
console.log(`Original size of hero.JPG: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);

// Try python PIL first if available
try {
  const pyCode = `
from PIL import Image
import os

img = Image.open(r"${inputPath.replace(/\\/g, '\\\\')}")
img.save(r"${outputPath.replace(/\\/g, '\\\\')}", "JPEG", quality=75, optimize=True)
size = os.path.getsize(r"${outputPath.replace(/\\/g, '\\\\')}")
print(f"Compressed size: {size / (1024*1024):.2f} MB")
`;
  fs.writeFileSync(path.join(__dirname, 'compress_temp.py'), pyCode);
  execSync('python scratch/compress_temp.py');
  console.log("Successfully compressed using Python PIL!");
} catch (err) {
  console.log("Python PIL failed, trying sharp/canvas or node fallback:", err.message);
}
