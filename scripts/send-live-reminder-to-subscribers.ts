import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { sendEmail } from '../lib/email'
import { createLiveReminderEmailTemplate } from '../lib/emailTemplates'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAFx_IzaLpF8hb9TEYdg-alaClzrN_6mNU',
  authDomain: 'coeur-a-corps.firebaseapp.com',
  projectId: 'coeur-a-corps',
  storageBucket: 'coeur-a-corps.firebasestorage.app',
  messagingSenderId: '369869488276',
  appId: '1:369869488276:web:6929b032a484a17c917481',
  measurementId: 'G-9YWCTPB6V1',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function sendLiveReminderToSubscribers() {
  try {
    // Get all newsletter subscribers
    console.log('Fetching subscribers...')
    const subscribersSnapshot = await getDocs(collection(db, 'newsletter'))

    // Create a Set to store unique email addresses
    const uniqueEmails = new Set<string>()

    // Add each email to the Set (this automatically removes duplicates)
    subscribersSnapshot.forEach((doc) => {
      const email = doc.data().email
      if (email) {
        uniqueEmails.add(email.toLowerCase()) // Convert to lowercase for consistency
      }
    })

    console.log(`Found ${uniqueEmails.size} unique subscribers`)

    // Send emails to unique subscribers
    let successCount = 0
    let failureCount = 0

    for (const email of uniqueEmails) {
      try {
        await sendEmail({
          to: email,
          from: 'a.ra@bluewin.ch',
          subject: 'Le live commence dans 5 minutes ! ',
          html: createLiveReminderEmailTemplate(),
        })
        successCount++
        console.log(` Email sent to ${email}`)

        // Add a small delay between emails to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        failureCount++
        console.error(` Failed to send email to ${email}:`, error)
      }
    }

    console.log('\nSummary:')
    console.log(` Successfully sent: ${successCount}`)
    console.log(` Failed to send: ${failureCount}`)
    console.log(`Total unique subscribers: ${uniqueEmails.size}`)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the function
sendLiveReminderToSubscribers()
