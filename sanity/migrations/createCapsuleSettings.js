require('dotenv').config()
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const createCapsuleSettings = async () => {
  try {
    // Check if capsuleSettings document already exists
    const existing = await client.fetch('*[_type == "capsuleSettings"][0]')
    
    if (!existing) {
      // Create the capsuleSettings document if it doesn't exist
      await client.create({
        _type: 'capsuleSettings',
        _id: 'capsuleSettings',
        title: 'CAPSULES AUDIO',
        description: 'Inscrivez-vous pour accéder à nos capsules podcast, à écouter en déplacement ou tranquillement chez vous.',
        buttonText: 'Accéder aux capsules',
        successMessage: 'Merci de votre inscription ! Vous recevrez bientôt un email de confirmation.',
        registeredUsers: []
      })
      console.log('✅ Capsule Settings document created')
    } else {
      console.log('ℹ️ Capsule Settings document already exists')
    }
  } catch (error) {
    console.error('Error creating capsule settings:', error)
    throw error
  }
}

createCapsuleSettings()
