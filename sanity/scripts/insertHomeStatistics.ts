const { createClient } = require('next-sanity')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
})

const statistics = {
  _type: 'statistics',
  title: 'Une approche unique de la thérapie relationnelle',
  statistics: [
    {
      _key: '1',
      _type: 'statistic',
      number: '95%',
      label: 'Taux de satisfaction client'
    },
    {
      _key: '2',
      _type: 'statistic',
      number: '500+',
      label: 'Couples accompagnés'
    },
    {
      _key: '3',
      _type: 'statistic',
      number: '20',
      label: 'Années d\'expérience'
    },
    {
      _key: '4',
      _type: 'statistic',
      number: '85%',
      label: 'Amélioration des relations'
    }
  ]
}

// Update the home document with the statistics
client
  .patch('home')
  .set({
    statistics: statistics.statistics
  })
  .commit()
  .then((res) => {
    console.log('Statistics updated successfully')
    console.log(res)
  })
  .catch((err) => {
    console.error('Error updating statistics:', err)
    console.error('Error details:', err.details)
  })
