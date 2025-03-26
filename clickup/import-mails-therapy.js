require('dotenv').config()
const axios = require('axios')

// ClickUp API Key & List ID from .env
const API_KEY = process.env.CLICKUP_API_KEY
const LIST_ID = process.env.LIST_ID
const USER_ID = '1404209' // Your ClickUp user ID

// Reference link to Google Sheets
const REFERENCE_LINK =
  'https://docs.google.com/spreadsheets/d/1I_mptVbT8PZTkCh-V51JoJcEY8B9KsLuTP_9_nqpG_M/edit?usp=sharing'

// Headers for authentication
const HEADERS = {
  Authorization: API_KEY,
  'Content-Type': 'application/json',
}

// Task data (Mail #, Formulaires, Contenus)
const tasks = [
  {
    name: 'Thérapie Couple - Mail 0 - Dès réservation et paiement',
    checklist: [
      'Email Template',
      'Inscription',
      'Paiement',
      '1ère date agenda',
      'Confirmation de la Thérapie',
      'AVC_1',
      'AGENDA COMPLET',
      'CONDITIONS GÉNÉRALES',
      'PROFIL DU COUPLE',
      'ESPACE CLIENT',
    ],
  },
  {
    name: "Thérapie Couple - Mail 1 - Après confirmation de l'agenda",
    checklist: [
      'Email Template',
      'AVC_1',
      'AGENDA COMPLET',
      'CONDITIONS GÉNÉRALES',
      'PROFIL DU COUPLE',
      'ESPACE CLIENT',
    ],
  },
  {
    name: 'Thérapie Couple - Mail 2 - 1 jour après la première séance de couple',
    checklist: ['Email Template', "Test de l'amoureux", 'APC_1'],
  },
  {
    name: 'Thérapie Couple - Mail 3 - 3 jours avant la séance individuelle 1',
    checklist: [
      'Email Template',
      'Capsule enfance',
      'Capsule *Interdictions – Obligations : Comment se construisent nos schémas relationnels*',
      'AV1_1',
    ],
  },
  {
    name: 'Thérapie Couple - Mail AS - Après séance individuelle 1',
    checklist: ['Email Template', "Vidéo *L'autorisation d'aimer*", 'FORM_AS'],
  },
  {
    name: 'Thérapie Couple - Mail 5 - 3 jours avant la 2e séance individuelle',
    checklist: [
      'Email Template',
      'Test de dépendance relationnelle',
      'Capsule dépendance et rejet',
      'FORM_ENTRE2',
    ],
  },
  {
    name: 'Thérapie Couple - Mail AS - Après séance individuelle 2',
    checklist: [
      'Email Template',
      "Test d'Estime de Soi",
      'Capsule *Désir de Soi*',
      'FORM_IAS',
    ],
  },
  {
    name: 'Thérapie Couple - Mail 6 - 3 jours avant la 3e séance individuelle',
    checklist: [
      'Email Template',
      'Formulaire introspection _ Entre 2',
      'FORM_AT',
    ],
  },
  {
    name: 'Thérapie Couple - Mail 7 - 5 jours avant la 2e séance de couple',
    checklist: ['Email Template', 'AVC_1_2'],
  },
  {
    name: 'Thérapie Couple - Mail 8 - 1 jour après la 2e séance de couple',
    checklist: [
      'Email Template',
      'Audio personnel en retour',
      'Test équilibre amoureux',
      'Capsule *Le Couple Conscient*',
    ],
  },
  {
    name: 'Thérapie Couple - Mail 9 - 2 semaines après la 3e séance de couple',
    checklist: [
      'Email Template',
      'Test État des lieux sexuel',
      'Code promo sur Cycle 2 (-10%)',
    ],
  },
]

// Function to create tasks and checklists
const createTasks = async () => {
  for (const task of tasks) {
    try {
      // Create a task in ClickUp
      const taskResponse = await axios.post(
        `https://api.clickup.com/api/v2/list/${LIST_ID}/task`,
        {
          name: task.name,
          status: 'to do',
          description: `Reference: ${REFERENCE_LINK}`,
          assignees: [USER_ID],
        },
        { headers: HEADERS },
      )

      if (taskResponse.data.id) {
        const taskId = taskResponse.data.id
        console.log(`✅ Task created: ${task.name} (ID: ${taskId})`)

        try {
          // Create a checklist inside the task
          console.log(
            `  Attempting to create checklist for task ID: ${taskId}...`,
          )
          const checklistResponse = await axios.post(
            `https://api.clickup.com/api/v2/task/${taskId}/checklist`,
            { name: 'Checklist' },
            { headers: HEADERS },
          )

          // The checklist ID is nested inside the 'checklist' object in the response
          if (
            checklistResponse.data &&
            checklistResponse.data.checklist &&
            checklistResponse.data.checklist.id
          ) {
            const checklistId = checklistResponse.data.checklist.id
            console.log(
              `  ✅ Checklist created for ${task.name} (ID: ${checklistId})`,
            )

            // Add checklist items
            for (const item of task.checklist) {
              try {
                const itemResponse = await axios.post(
                  `https://api.clickup.com/api/v2/checklist/${checklistId}/checklist_item`,
                  { name: item },
                  { headers: HEADERS },
                )
                console.log(`    ✅ Checklist item added: ${item}`)
              } catch (itemError) {
                console.error(
                  `    ❌ Error adding checklist item: ${item}`,
                  itemError.response?.data || itemError.message,
                )
              }
            }
          } else {
            console.error(
              `  ❌ Failed to get checklist ID from response:`,
              checklistResponse.data,
            )
          }
        } catch (checklistError) {
          console.error(
            `  ❌ Error creating checklist for ${task.name}:`,
            checklistError.response?.data || checklistError.message,
          )
        }
      }
    } catch (error) {
      console.error(
        `❌ Error creating task: ${task.name}`,
        error.response?.data || error.message,
      )
    }
  }
}

// Run the script
createTasks()
