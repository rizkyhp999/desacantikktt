const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const inputPath = path.join(__dirname, '../public/foto-kegiatan/hero.JPG');
const minPath = path.join(__dirname, '../public/foto-kegiatan/hero_min.jpg');

// Resize to max width 1600px and compress to ~300KB
const pyCode = `
from PIL import Image
import os

img = Image.open(r"${inputPath.replace(/\\/g, '\\\\')}")
img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
img.save(r"${minPath.replace(/\\/g, '\\\\')}", "JPEG", quality=78, optimize=True)

size_orig = os.path.getsize(r"${inputPath.replace(/\\/g, '\\\\')}")
size_min = os.path.getsize(r"${minPath.replace(/\\/g, '\\\\')}")

print(f"Original: {size_orig / 1024:.1f} KB -> Compressed: {size_min / 1024:.1f} KB")
`;

fs.writeFileSync(path.join(__dirname, 'compress_hero.py'), pyCode);
execSync('python scratch/compress_hero.py');
