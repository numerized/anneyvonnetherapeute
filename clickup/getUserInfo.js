require('dotenv').config()
const axios = require('axios')

// ClickUp API Key & Team ID from .env
const API_KEY = process.env.CLICKUP_API_KEY
const TEAM_ID = process.env.TEAM_ID

// Headers for authentication
const HEADERS = {
  Authorization: API_KEY,
  'Content-Type': 'application/json',
}

// Function to get team information including user details
const getTeamInfo = async () => {
  try {
    const response = await axios.get(
      `https://api.clickup.com/api/v2/team/${TEAM_ID}`,
      { headers: HEADERS },
    )

    if (response.data && response.data.team) {
      console.log('Team Name:', response.data.team.name)
      console.log('\nTeam Members:')

      response.data.team.members.forEach((member) => {
        console.log(`\nUser: ${member.user.username} (${member.user.email})`)
        console.log(`User ID: ${member.user.id}`)
        console.log(`Role: ${member.role}`)
      })

      return response.data
    } else {
      console.error('❌ No team data found')
      return null
    }
  } catch (error) {
    console.error(
      '❌ Error getting team info:',
      error.response?.data || error.message,
    )
    return null
  }
}

// Run the function
getTeamInfo()
