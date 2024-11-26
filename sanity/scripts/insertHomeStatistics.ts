import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN, // Need a write token
  apiVersion: '2023-05-03',
  useCdn: false,
})

const statistics = [
  {
    number: '95%',
    label: 'Taux de satisfaction client'
  },
  {
    number: '500+',
    label: 'Couples accompagnés'
  },
  {
    number: '20',
    label: 'Années d\'expérience'
  },
  {
    number: '85%',
    label: 'Amélioration des relations'
  }
]

// Update the home document with the statistics
client
  .patch('home') // Assuming 'home' is the document ID
  .set({
    statistics: statistics
  })
  .commit()
  .then((res) => {
    console.log('Statistics updated successfully')
    console.log(res)
  })
  .catch((err) => {
    console.error('Error updating statistics:', err)
  })
