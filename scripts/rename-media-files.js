const fs = require('fs');
const path = require('path');

// Function to make filenames web-compatible
function makeWebCompatible(filename) {
  // Replace spaces with hyphens
  let newName = filename.replace(/\s+/g, '-');
  
  // Remove special characters and accents
  newName = newName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove accents
    .replace(/[\'\"]/g, '')           // Remove quotes
    .replace(/[^\w\-\.]/g, '_');      // Replace other special chars with underscores
  
  return newName;
}

// Function to rename files in a directory
function renameFilesInDirectory(directory) {
  const files = fs.readdirSync(directory);
  const renamedFiles = {};
  
  files.forEach(file => {
    // Skip hidden files and directories
    if (file.startsWith('.') || fs.statSync(path.join(directory, file)).isDirectory()) {
      return;
    }
    
    const newFilename = makeWebCompatible(file);
    
    // Skip if filename already compatible
    if (newFilename === file) {
      renamedFiles[file] = file; // Still add to mapping for completeness
      return;
    }
    
    const oldPath = path.join(directory, file);
    const newPath = path.join(directory, newFilename);
    
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${file} → ${newFilename}`);
      renamedFiles[file] = newFilename;
    } catch (error) {
      console.error(`Error renaming ${file}:`, error);
    }
  });
  
  return renamedFiles;
}

// Directories to process
const directories = [
  path.join(__dirname, '..', 'public', 'CAPSULES_MINUTES'),
  path.join(__dirname, '..', 'public', 'CAPSULES_MIROIR')
];

// Process all directories and collect filename mappings
const allRenamedFiles = {};

directories.forEach(dir => {
  console.log(`\nProcessing directory: ${dir}`);
  const renamedInDir = renameFilesInDirectory(dir);
  
  // Add directory info to keys
  const dirName = path.basename(dir);
  Object.entries(renamedInDir).forEach(([oldName, newName]) => {
    allRenamedFiles[`/${dirName}/${oldName}`] = `/${dirName}/${newName}`;
  });
});

// Save mapping to a JSON file for reference
const mappingPath = path.join(__dirname, 'filename-mapping.json');
fs.writeFileSync(mappingPath, JSON.stringify(allRenamedFiles, null, 2));
console.log(`\nFilename mapping saved to: ${mappingPath}`);

console.log('\nDone! Use the filename-mapping.json file to update references in your code.');
