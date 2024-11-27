import { writeClient } from '@/sanity/lib/client'

const capsuleSettings = {
  _type: 'capsuleSettings',
  _id: 'capsuleSettings',
  title: 'Recevez nos capsules audio gratuites',
  description: 'Inscrivez-vous pour recevoir nos capsules audio hebdomadaires gratuites sur la thérapie relationnelle.',
  buttonText: 'Je m\'inscris',
  successMessage: 'Merci pour votre inscription ! Vous recevrez bientôt nos capsules audio.',
  registeredUsers: []
}

// Create the capsule settings document
async function createCapsuleSettings() {
  try {
    // Check if document already exists
    const existingDoc = await writeClient.fetch(
      '*[_type == "capsuleSettings"][0]'
    )

    if (existingDoc) {
      console.log('Capsule settings document already exists')
      return
    }

    // Create the document
    const result = await writeClient.create(capsuleSettings)
    console.log(`Capsule settings created: ${result._id}`)
  } catch (error) {
    console.error('Error creating capsule settings:', error)
  }
}

createCapsuleSettings()
