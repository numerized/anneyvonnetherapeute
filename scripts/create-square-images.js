const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(process.cwd(), 'public', 'CAPSULES MIROIR_VISUELS');
const targetDir = path.join(sourceDir, 'square');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Process all images in the source directory
async function processImages() {
  try {
    const files = fs.readdirSync(sourceDir);
    
    for (const file of files) {
      // Skip directories and non-image files
      const ext = path.extname(file).toLowerCase();
      if (!ext.match(/\.(jpg|jpeg|png|webp|gif)$/) || fs.statSync(path.join(sourceDir, file)).isDirectory()) {
        continue;
      }
      
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);
      
      // Get image metadata
      const metadata = await sharp(sourceFile).metadata();
      const { width, height } = metadata;
      
      // Calculate center crop for square
      const size = Math.min(width, height);
      const left = Math.floor((width - size) / 2);
      const top = 0; // Keep top aligned
      
      // Create square version (crop from center)
      await sharp(sourceFile)
        .extract({ left, top, width: size, height: size })
        .toFile(targetFile);
      
      console.log(`Processed: ${file}`);
    }
    
    console.log('All images processed successfully!');
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

processImages();
