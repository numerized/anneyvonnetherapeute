const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Directory paths
const videoDir = path.join(__dirname, '../public/CAPSULES_MINUTES')
const posterDir = path.join(__dirname, '../public/images/posters')

// Create the poster directory if it doesn't exist
if (!fs.existsSync(posterDir)) {
  fs.mkdirSync(posterDir, { recursive: true })
  console.log(`Created poster directory at ${posterDir}`)
}

// Get all video files
const videoFiles = fs
  .readdirSync(videoDir)
  .filter(
    (file) =>
      file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.mov'),
  )

console.log(`Found ${videoFiles.length} video files in ${videoDir}`)

// Process each video file
const posterPaths = {}

videoFiles.forEach((videoFile) => {
  const videoPath = path.join(videoDir, videoFile)

  // Create a filename for the poster
  const baseName = path.basename(videoFile, path.extname(videoFile))
  const posterFileName = `${baseName}-poster.jpg`
  const posterPath = path.join(posterDir, posterFileName)

  console.log(`Generating poster for ${videoFile}...`)

  try {
    // Extract the first frame using ffmpeg
    const command = `ffmpeg -i "${videoPath}" -ss 00:00:01 -vframes 1 -q:v 2 "${posterPath}" -y`
    execSync(command)

    console.log(`Created poster at ${posterPath}`)

    // Store the relative path for the component
    posterPaths[videoFile] = `/images/posters/${posterFileName}`
  } catch (error) {
    console.error(`Error generating poster for ${videoFile}:`, error.message)
  }
})

// Save mapping to a JSON file
const mappingPath = path.join(__dirname, 'poster-mapping.json')
fs.writeFileSync(mappingPath, JSON.stringify(posterPaths, null, 2))
console.log(`\nPoster mapping saved to: ${mappingPath}`)

console.log(
  '\nDone! Update your React component to use the generated poster images.',
)
