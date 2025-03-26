require('dotenv').config()
const axios = require('axios')

// ClickUp API Key from .env
const API_KEY = process.env.CLICKUP_API_KEY
const LIST_ID = process.env.LIST_ID

// Headers for authentication
const HEADERS = {
  Authorization: API_KEY,
  'Content-Type': 'application/json',
}

// Task IDs from the most recent run
const TASK_IDS = [
  '86c2c2qke', // Thérapie Couple - Mail 0
  '86c2c2qm1', // Thérapie Couple - Mail 1
  '86c2c2qmc', // Thérapie Couple - Mail 2
  '86c2c2qmq', // Thérapie Couple - Mail 3
  '86c2c2qmx', // Thérapie Couple - Mail AS
  '86c2c2qn4', // Thérapie Couple - Mail 5
  '86c2c2qnb', // Thérapie Couple - Mail AS
  '86c2c2qnh', // Thérapie Couple - Mail 6
  '86c2c2qnm', // Thérapie Couple - Mail 7
  '86c2c2qnt', // Thérapie Couple - Mail 8
  '86c2c2qnz', // Thérapie Couple - Mail 9
]

// Function to get task details including checklists
const getTaskDetails = async (taskId) => {
  try {
    console.log(`Getting details for task ${taskId}...`)

    const response = await axios.get(
      `https://api.clickup.com/api/v2/task/${taskId}?include_subtasks=false&custom_task_ids=true&team_id=${process.env.TEAM_ID}`,
      { headers: HEADERS },
    )

    if (response.data && response.data.checklists) {
      console.log(
        `✅ Found ${response.data.checklists.length} checklists for task ${taskId}`,
      )
      return response.data.checklists
    } else {
      console.error(`❌ No checklists found for task ${taskId}`)
      return null
    }
  } catch (error) {
    console.error(
      `❌ Error getting task details for ${taskId}:`,
      error.response?.data || error.message,
    )
    return null
  }
}

// Function to mark a checklist item as complete
const markChecklistItemComplete = async (taskId, checklistId, itemId) => {
  try {
    console.log(`Marking checklist item ${itemId} as complete...`)

    // According to ClickUp API docs, this is the correct endpoint to update a checklist item
    const response = await axios.put(
      `https://api.clickup.com/api/v2/checklist/${checklistId}/checklist_item/${itemId}`,
      { resolved: true },
      { headers: HEADERS },
    )

    if (response.status === 200) {
      console.log(`✅ Checklist item ${itemId} marked as complete`)
      return true
    } else {
      console.error(`❌ Failed to mark checklist item ${itemId} as complete`)
      return false
    }
  } catch (error) {
    // Try an alternative approach if the first one fails
    try {
      console.log(`Trying alternative method to mark item as complete...`)

      // Some API versions use this endpoint instead
      const response = await axios.put(
        `https://api.clickup.com/api/v2/task/${taskId}/checklist/${checklistId}/checklist_item/${itemId}`,
        { resolved: true },
        { headers: HEADERS },
      )

      if (response.status === 200) {
        console.log(
          `✅ Checklist item ${itemId} marked as complete (alternative method)`,
        )
        return true
      } else {
        console.error(
          `❌ Failed to mark checklist item ${itemId} as complete (alternative method)`,
        )
        return false
      }
    } catch (altError) {
      console.error(
        `❌ Error marking checklist item ${itemId} as complete (both methods):`,
        error.response?.data || error.message,
        altError.response?.data || altError.message,
      )
      return false
    }
  }
}

// Main function
const markEmailTemplatesComplete = async () => {
  console.log(
    `Marking "Email Template" checklist items as complete for ${TASK_IDS.length} tasks...`,
  )

  let successCount = 0

  for (const taskId of TASK_IDS) {
    const checklists = await getTaskDetails(taskId)
    if (!checklists || checklists.length === 0) continue

    // Process each checklist in the task
    for (const checklist of checklists) {
      // Find the "Email Template" item
      const emailTemplateItem = checklist.items.find(
        (item) => item.name === 'Email Template',
      )
      if (!emailTemplateItem) {
        console.log(
          `No "Email Template" item found in checklist ${checklist.id} for task ${taskId}`,
        )
        continue
      }

      // Skip if already resolved
      if (emailTemplateItem.resolved) {
        console.log(
          `"Email Template" item already marked as complete in task ${taskId}`,
        )
        successCount++
        continue
      }

      const success = await markChecklistItemComplete(
        taskId,
        checklist.id,
        emailTemplateItem.id,
      )
      if (success) {
        successCount++
        break // Break after finding and marking the first "Email Template" item
      }
    }
  }

  console.log(
    `✅ Successfully marked "Email Template" as complete for ${successCount} out of ${TASK_IDS.length} tasks`,
  )
}

// Run the script
markEmailTemplatesComplete()
