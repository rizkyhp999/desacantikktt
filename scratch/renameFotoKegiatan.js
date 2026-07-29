const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '../public/foto-kegiatan');
const files = fs.readdirSync(dirPath);

console.log(`Found ${files.length} files in public/foto-kegiatan:`);

// Sort files to have deterministic order
files.sort();

files.forEach((file, index) => {
  const oldPath = path.join(dirPath, file);
  const ext = path.extname(file);
  const newName = `${index + 1}${ext}`;
  const newPath = path.join(dirPath, newName);

  fs.renameSync(oldPath, newPath);
  console.log(`Renamed: "${file}" -> "${newName}"`);
});

console.log("All 18 photos successfully renamed!");
