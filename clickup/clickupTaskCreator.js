require("dotenv").config();
const axios = require("axios");

// ClickUp API Key & List ID from .env
const API_KEY = process.env.CLICKUP_API_KEY;
const LIST_ID = process.env.LIST_ID;

// Headers for authentication
const HEADERS = {
  Authorization: API_KEY,
  "Content-Type": "application/json",
};

/**
 * Creates a task in ClickUp
 * @param {string} name - The name of the task
 * @param {string} status - The status of the task (default: "to do")
 * @param {array} checklistItems - Array of checklist items to add to the task
 */
async function createTask(name, status = "to do", checklistItems = []) {
  try {
    // Create a task in ClickUp
    const taskResponse = await axios.post(
      `https://api.clickup.com/api/v2/list/${LIST_ID}/task`,
      { name, status },
      { headers: HEADERS }
    );

    if (taskResponse.data.id) {
      const taskId = taskResponse.data.id;
      console.log(`✅ Task created: ${name} (ID: ${taskId})`);

      if (checklistItems.length > 0) {
        // Create a checklist inside the task
        const checklistResponse = await axios.post(
          `https://api.clickup.com/api/v2/task/${taskId}/checklist`,
          { name: "Checklist" },
          { headers: HEADERS }
        );

        // The checklist ID is nested inside the 'checklist' object in the response
        if (checklistResponse.data && checklistResponse.data.checklist && checklistResponse.data.checklist.id) {
          const checklistId = checklistResponse.data.checklist.id;
          console.log(`✅ Checklist created for ${name} (ID: ${checklistId})`);

          // Add checklist items
          for (const item of checklistItems) {
            await axios.post(
              `https://api.clickup.com/api/v2/checklist/${checklistId}/checklist_item`,
              { name: item },
              { headers: HEADERS }
            );
            console.log(`   ✅ Checklist item added: ${item}`);
          }
        } else {
          console.error(`❌ Failed to get checklist ID from response:`, checklistResponse.data);
        }
      }
      
      return taskId;
    }
  } catch (error) {
    console.error(`❌ Error creating task: ${name}`, error.response?.data || error.message);
    return null;
  }
}

// If this file is run directly (not imported)
if (require.main === module) {
  // Example usage
  (async () => {
    const taskId = await createTask(
      "Example Task", 
      "to do", 
      ["Item 1", "Item 2", "Item 3"]
    );
    
    if (taskId) {
      console.log(`Task created successfully with ID: ${taskId}`);
    } else {
      console.log("Failed to create task");
    }
  })();
}

// Export the function for use in other files
module.exports = { createTask };
