require('dotenv').config()
const axios = require('axios')

// ClickUp API Key from .env
const API_KEY = process.env.CLICKUP_API_KEY

// Headers for authentication
const HEADERS = {
  Authorization: API_KEY,
  'Content-Type': 'application/json',
}

// Task IDs from the most recent run
const TASK_IDS = [
  '86c2c2kub', // Mail 0
  '86c2c2kun', // Mail 1
  '86c2c2kvc', // Mail 2
  '86c2c2kw7', // Mail 3
  '86c2c2kxb', // Mail AS
  '86c2c2kxx', // Mail 5
  '86c2c2kyd', // Mail AS
  '86c2c2kyr', // Mail 6
  '86c2c2kz4', // Mail 7
  '86c2c2kza', // Mail 8
  '86c2c2kzg', // Mail 9
]

// Checklist IDs from the most recent run
const CHECKLIST_IDS = {
  '86c2c2kub': '4dea2729-46e4-4cd6-80a1-c18c71c10825', // Mail 0
  '86c2c2kun': '2d9de9f3-74bd-40c4-9272-381b0e9d153d', // Mail 1
  '86c2c2kvc': '2f7c0f6e-c039-4b88-89ab-2c0593bb4b3f', // Mail 2
  '86c2c2kw7': 'fd700067-121f-4287-b0e0-95934d431f85', // Mail 3
  '86c2c2kxb': '78586c6f-ed37-4961-b161-a81f2fe7b0ef', // Mail AS
  '86c2c2kxx': '886e0591-08be-40c0-b3da-2327a6bf6008', // Mail 5
  '86c2c2kyd': 'cac99d5f-f849-488b-8911-dfcbc82fc4e0', // Mail AS
  '86c2c2kyr': '4f20101e-1222-45c0-9797-e2fd6b6f6d20', // Mail 6
  '86c2c2kz4': 'c822dc97-3ef3-455e-bb32-e2d04ad65c99', // Mail 7
  '86c2c2kza': '1b38ba7d-f13c-449e-ab37-cd6dd7a0bd35', // Mail 8
  '86c2c2kzg': 'd54c29fe-f8de-4fcd-a9e0-b5682edeecd1', // Mail 9
}

// Function to add "Email Template" checklist item to a task
const addEmailTemplateItem = async (taskId) => {
  try {
    const checklistId = CHECKLIST_IDS[taskId]
    if (!checklistId) {
      console.error(`❌ No checklist ID found for task ${taskId}`)
      return false
    }

    console.log(
      `Adding "Email Template" to task ${taskId} (checklist: ${checklistId})...`,
    )

    const response = await axios.post(
      `https://api.clickup.com/api/v2/checklist/${checklistId}/checklist_item`,
      { name: 'Email Template' },
      { headers: HEADERS },
    )

    if (response.status === 200 || response.status === 201) {
      console.log(`✅ Added "Email Template" to task ${taskId}`)
      return true
    } else {
      console.error(`❌ Failed to add "Email Template" to task ${taskId}`)
      return false
    }
  } catch (error) {
    console.error(
      `❌ Error adding "Email Template" to task ${taskId}:`,
      error.response?.data || error.message,
    )
    return false
  }
}

// Main function
const addEmailTemplateToAllTasks = async () => {
  console.log(
    `Adding "Email Template" checklist item to ${TASK_IDS.length} tasks...`,
  )

  let successCount = 0
  for (const taskId of TASK_IDS) {
    const success = await addEmailTemplateItem(taskId)
    if (success) {
      successCount++
    }
  }

  console.log(
    `✅ Successfully added "Email Template" to ${successCount} out of ${TASK_IDS.length} tasks`,
  )
}

// Run the script
addEmailTemplateToAllTasks()
