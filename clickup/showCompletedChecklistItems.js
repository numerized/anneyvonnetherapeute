require('dotenv').config()
const axios = require('axios')

// ClickUp API Key from .env
const API_KEY = process.env.CLICKUP_API_KEY
const TEAM_ID = process.env.TEAM_ID

// Headers for authentication
const HEADERS = {
  Authorization: API_KEY,
  'Content-Type': 'application/json',
}

// Function to get all users in the workspace
const getWorkspaceUsers = async () => {
  try {
    console.log(`Getting all users in workspace (Team ID: ${TEAM_ID})...`)

    const response = await axios.get(
      `https://api.clickup.com/api/v2/team/${TEAM_ID}`,
      { headers: HEADERS },
    )

    if (response.data && response.data.team && response.data.team.members) {
      const members = response.data.team.members
      console.log(`✅ Found ${members.length} users in the workspace`)
      return members
    } else {
      console.error('❌ No users found in the workspace')
      return []
    }
  } catch (error) {
    console.error(
      '❌ Error getting workspace users:',
      error.response?.data || error.message,
    )
    return []
  }
}

// Function to update workspace settings for all users
const updateWorkspaceSettings = async () => {
  try {
    console.log(
      'Updating workspace settings to show completed checklist items for all users...',
    )

    const response = await axios.put(
      `https://api.clickup.com/api/v2/team/${TEAM_ID}`,
      {
        settings: {
          show_resolved_checklist_items: true,
        },
      },
      { headers: HEADERS },
    )

    if (response.status === 200) {
      console.log(
        '✅ Successfully updated workspace settings to show completed checklist items for all users',
      )
      return true
    } else {
      console.error('❌ Failed to update workspace settings')
      return false
    }
  } catch (error) {
    console.error(
      '❌ Error updating workspace settings:',
      error.response?.data || error.message,
    )
    return false
  }
}

// Function to update individual user preferences
const updateUserPreferences = async (user) => {
  try {
    console.log(
      `Updating preferences for user: ${user.user.username} (ID: ${user.user.id})...`,
    )

    const response = await axios.put(
      `https://api.clickup.com/api/v2/team/${TEAM_ID}/user/${user.user.id}`,
      {
        user_settings: {
          show_resolved_checklist_items: true,
        },
      },
      { headers: HEADERS },
    )

    if (response.status === 200) {
      console.log(
        `✅ Successfully updated preferences for user: ${user.user.username}`,
      )
      return true
    } else {
      console.error(
        `❌ Failed to update preferences for user: ${user.user.username}`,
      )
      return false
    }
  } catch (error) {
    console.error(
      `❌ Error updating preferences for user ${user.user.username}:`,
      error.response?.data || error.message,
    )
    return false
  }
}

// Main function
const main = async () => {
  console.log(
    'Starting to update preferences to show completed checklist items...',
  )

  // First, try to update workspace-wide settings
  const workspaceSuccess = await updateWorkspaceSettings()

  if (workspaceSuccess) {
    console.log(
      '\n✅ COMPLETED: Workspace settings have been updated to show completed checklist items by default for all users',
    )
    console.log(
      '   All users should refresh their ClickUp interface to see the changes',
    )
    return
  }

  // If workspace-wide update fails, try updating individual user preferences
  console.log('\nAttempting to update individual user preferences...')

  const users = await getWorkspaceUsers()
  if (users.length === 0) {
    console.error('❌ Cannot proceed without user information')
    return
  }

  let successCount = 0

  for (const user of users) {
    const success = await updateUserPreferences(user)
    if (success) {
      successCount++
    }
  }

  console.log(
    `\n✅ Successfully updated preferences for ${successCount} out of ${users.length} users`,
  )

  if (successCount < users.length) {
    console.log(
      "\nFor users whose preferences couldn't be updated, they may need to manually change this setting:",
    )
    console.log('1. Click on their profile picture in the bottom left')
    console.log("2. Select 'Settings'")
    console.log("3. Go to the 'Preferences' tab")
    console.log("4. Find and enable 'Show completed checklist items'")
  }
}

// Run the script
main()
