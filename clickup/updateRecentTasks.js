require("dotenv").config();
const axios = require("axios");

// ClickUp API Key from .env
const API_KEY = process.env.CLICKUP_API_KEY;

// Headers for authentication
const HEADERS = {
  Authorization: API_KEY,
  "Content-Type": "application/json",
};

// Google Sheets reference link
const REFERENCE_LINK = "https://docs.google.com/spreadsheets/d/1I_mptVbT8PZTkCh-V51JoJcEY8B9KsLuTP_9_nqpG_M/edit?usp=sharing";

// Get task IDs from command line arguments or use the default ones
const TASK_IDS = process.argv.slice(2).length > 0 
  ? process.argv.slice(2) 
  : [
      "86c2c2jj8",  // Mail 0
      "86c2c2jk1",  // Mail 1
      "86c2c2jka",  // Mail 2
      "86c2c2jkh",  // Mail 3
      "86c2c2jku",  // Mail AS
      "86c2c2jkz",  // Mail 5
      "86c2c2jma",  // Mail AS
      "86c2c2jmp",  // Mail 6
      "86c2c2jmx",  // Mail 7
      "86c2c2jn2",  // Mail 8
      "86c2c2jnd"   // Mail 9
    ];

// Your ClickUp user ID (we already found it: 170663478)
const USER_ID = "170663478";

// Function to update a task (assign to user and add reference link)
const updateTask = async (taskId) => {
  try {
    console.log(`Updating task ${taskId}...`);
    const response = await axios.put(
      `https://api.clickup.com/api/v2/task/${taskId}`,
      {
        assignees: {
          add: [USER_ID]
        },
        description: `Reference: ${REFERENCE_LINK}`
      },
      { headers: HEADERS }
    );
    
    if (response.status === 200) {
      console.log(`✅ Task ${taskId} updated successfully`);
      return true;
    } else {
      console.error(`❌ Failed to update task ${taskId}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating task ${taskId}:`, error.response?.data || error.message);
    return false;
  }
};

// Main function
const updateTasks = async () => {
  console.log(`Updating ${TASK_IDS.length} tasks...`);
  
  let successCount = 0;
  for (const taskId of TASK_IDS) {
    const success = await updateTask(taskId);
    if (success) {
      successCount++;
    }
  }
  
  console.log(`✅ Successfully updated ${successCount} out of ${TASK_IDS.length} tasks`);
};

// Run the script
updateTasks();
