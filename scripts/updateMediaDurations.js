#!/usr/bin/env node

/**
 * Script to scan media files and update the capsules constant with duration information
 * This script uses ffprobe (part of ffmpeg) to get media durations without loading the entire file
 *
 * Usage: node scripts/updateMediaDurations.js
 *
 * Requirements:
 * - ffprobe (part of ffmpeg) must be installed on the system
 * - Run this script after adding new media files to update the durations
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Path to the capsules file
const CAPSULES_FILE_PATH = path.join(
  __dirname,
  '../components/pages/espace180/data/capsules.ts',
)

// Public directory where media files are stored
const PUBLIC_DIR = path.join(__dirname, '../public')

/**
 * Format duration in seconds to the required format (e.g., 1m40s, 45s, 6min32s)
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  if (minutes === 0) {
    return `${remainingSeconds}s`
  } else if (remainingSeconds === 0) {
    return `${minutes}min`
  } else if (minutes < 10) {
    return `${minutes}m${remainingSeconds}s`
  } else {
    return `${minutes}min${remainingSeconds}s`
  }
}

/**
 * Get media duration using ffprobe
 * @param {string} mediaPath - Full path to the media file
 * @returns {number} Duration in seconds or null if error
 */
function getMediaDuration(mediaPath) {
  try {
    // Use ffprobe to get duration without loading the entire file
    const output = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${mediaPath}"`,
      { encoding: 'utf-8' },
    )

    const duration = parseFloat(output.trim())
    return isNaN(duration) ? null : duration
  } catch (error) {
    console.error(`Error getting duration for ${mediaPath}:`, error.message)
    return null
  }
}

/**
 * Update the capsules constant in the page.tsx file with duration information
 */
async function updateCapsulesWithDuration() {
  try {
    // Read the file content
    const fileContent = fs.readFileSync(CAPSULES_FILE_PATH, 'utf-8')

    // Extract the capsules array using regex - updated for export const syntax
    const capsulesRegex =
      /export\s+const\s+capsules\s*:\s*Capsule\[\]\s*=\s*\[([\s\S]*?)\]/
    const capsulesMatch = fileContent.match(capsulesRegex)

    if (!capsulesMatch) {
      console.error('Could not find capsules array in the file')
      return
    }

    const capsulesContent = capsulesMatch[1]

    // Parse each capsule object
    const capsuleObjects = []
    let currentObject = ''
    let braceCount = 0

    for (let i = 0; i < capsulesContent.length; i++) {
      const char = capsulesContent[i]

      if (char === '{') {
        braceCount++
        if (braceCount === 1) {
          currentObject = '{'
          continue
        }
      } else if (char === '}') {
        braceCount--
        if (braceCount === 0) {
          currentObject += '}'
          capsuleObjects.push(currentObject)
          currentObject = ''
          continue
        }
      }

      if (braceCount > 0) {
        currentObject += char
      }
    }

    // Process each capsule object
    const updatedCapsuleObjects = capsuleObjects.map((capsuleStr) => {
      // Extract mediaUrl using regex
      const mediaUrlRegex = /mediaUrl\s*:\s*['"]([^'"]+)['"]/
      const mediaUrlMatch = capsuleStr.match(mediaUrlRegex)

      if (!mediaUrlMatch) {
        console.error('Could not find mediaUrl in capsule:', capsuleStr)
        return capsuleStr
      }

      const mediaUrl = mediaUrlMatch[1]
      const fullMediaPath = path.join(PUBLIC_DIR, mediaUrl)

      // Check if file exists
      if (!fs.existsSync(fullMediaPath)) {
        console.error(`Media file not found: ${fullMediaPath}`)
        return capsuleStr
      }

      // Get duration
      const durationInSeconds = getMediaDuration(fullMediaPath)

      if (durationInSeconds === null) {
        console.error(`Could not get duration for: ${mediaUrl}`)
        return capsuleStr
      }

      const formattedDuration = formatDuration(durationInSeconds)

      // Check if duration already exists
      const hasDuration = /duration\s*:\s*['"][^'"]+['"]/.test(capsuleStr)

      if (hasDuration) {
        // Update existing duration
        return capsuleStr.replace(
          /duration\s*:\s*['"][^'"]+['"]/,
          `duration: "${formattedDuration}"`,
        )
      } else {
        // Add duration property before the last property (which is typically mediaType)
        return capsuleStr.replace(
          /(\s*)(mediaType\s*:)/,
          `$1duration: "${formattedDuration}",$1$2`,
        )
      }
    })

    // Update the file content
    let updatedContent = fileContent.replace(
      capsulesRegex,
      `export const capsules: Capsule[] = [${updatedCapsuleObjects.join(',')}];`,
    )

    // Update the Capsule interface to include duration if it doesn't already
    const capsuleInterfaceRegex = /export\s+interface\s+Capsule\s*{([\s\S]*?)}/
    const capsuleInterfaceMatch = fileContent.match(capsuleInterfaceRegex)

    if (capsuleInterfaceMatch) {
      const interfaceContent = capsuleInterfaceMatch[1]

      if (!interfaceContent.includes('duration')) {
        const updatedInterface =
          interfaceContent.trim() + '\n  duration?: string\n'
        updatedContent = updatedContent.replace(
          capsuleInterfaceRegex,
          `export interface Capsule {${updatedInterface}}`,
        )
      }
    }

    // Write the updated content back to the file
    fs.writeFileSync(CAPSULES_FILE_PATH, updatedContent, 'utf-8')

    console.log('Successfully updated capsules with duration information')
  } catch (error) {
    console.error('Error updating capsules with duration:', error)
  }
}

/**
 * Check if ffprobe is installed
 * @returns {boolean} True if ffprobe is available
 */
function checkFfprobeAvailability() {
  try {
    execSync('ffprobe -version', { stdio: 'ignore' })
    return true
  } catch (error) {
    return false
  }
}

// Main execution
if (!checkFfprobeAvailability()) {
  console.error(
    'Error: ffprobe is not installed or not in PATH. Please install ffmpeg/ffprobe first.',
  )
  process.exit(1)
}

updateCapsulesWithDuration()
