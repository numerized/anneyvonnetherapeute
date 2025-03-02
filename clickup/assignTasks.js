require("dotenv").config();
const axios = require("axios");

// ClickUp API Key & Team ID from .env
const API_KEY = process.env.CLICKUP_API_KEY;
const TEAM_ID = process.env.TEAM_ID;
const LIST_ID = process.env.LIST_ID;

// Headers for authentication
const HEADERS = {
  Authorization: API_KEY,
  "Content-Type": "application/json",
};

// Google Sheets reference link
const REFERENCE_LINK = "https://docs.google.com/spreadsheets/d/1I_mptVbT8PZTkCh-V51JoJcEY8B9KsLuTP_9_nqpG_M/edit?usp=sharing";

// Function to get user ID
const getUserId = async () => {
  try {
    const response = await axios.get(
      `https://api.clickup.com/api/v2/team/${TEAM_ID}`,
      { headers: HEADERS }
    );
    
    if (response.data && response.data.team && response.data.team.members && response.data.team.members.length > 0) {
      // Return the first user's ID (assuming it's you)
      return response.data.team.members[0].user.id;
    } else {
      console.error("❌ No users found in the team");
      return null;
    }
  } catch (error) {
    console.error("❌ Error getting user ID:", error.response?.data || error.message);
    return null;
  }
};

// Function to get all tasks in the list
const getTasks = async () => {
  try {
    const response = await axios.get(
      `https://api.clickup.com/api/v2/list/${LIST_ID}/task?include_closed=true`,
      { headers: HEADERS }
    );
    
    if (response.data && response.data.tasks) {
      console.log(`Found ${response.data.tasks.length} tasks in the response`);
      return response.data.tasks;
    } else {
      console.error("❌ No tasks found in the list");
      console.log("Response data:", JSON.stringify(response.data, null, 2));
      return [];
    }
  } catch (error) {
    console.error("❌ Error getting tasks:", error.response?.data || error.message);
    return [];
  }
};

// Function to update a task (assign to user and add reference link)
const updateTask = async (taskId, userId) => {
  try {
    const response = await axios.put(
      `https://api.clickup.com/api/v2/task/${taskId}`,
      {
        assignees: {
          add: [userId]
        },
        description: `Reference: ${REFERENCE_LINK}`
      },
      { headers: HEADERS }
    );
    
    if (response.data) {
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
const assignTasksToMe = async () => {
  // Get your user ID
  const userId = await getUserId();
  if (!userId) {
    console.error("❌ Could not get user ID. Aborting.");
    return;
  }
  
  console.log(`✅ Found user ID: ${userId}`);
  
  // Get all tasks
  const tasks = await getTasks();
  if (tasks.length === 0) {
    console.error("❌ No tasks found to update");
    return;
  }
  
  console.log(`✅ Found ${tasks.length} tasks to update`);
  
  // Update each task
  let successCount = 0;
  for (const task of tasks) {
    const success = await updateTask(task.id, userId);
    if (success) {
      successCount++;
    }
  }
  
  console.log(`✅ Successfully updated ${successCount} out of ${tasks.length} tasks`);
};

// Run the script
assignTasksToMe();
