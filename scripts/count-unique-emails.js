const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin with service account
// You'll need to provide your service account key in the same directory
const serviceAccount = require('./firebase-service-account.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Helper function to format dates in French
function formatDate(date) {
  const options = { month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

// Helper function to get the start and end date of a week
function getWeekDates(firstDate, weekNum) {
  const startDate = new Date(firstDate);
  startDate.setDate(startDate.getDate() + (weekNum - 1) * 7);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  
  return {
    start: formatDate(startDate),
    end: formatDate(endDate)
  };
}

async function countUniqueEmailsPerWeek() {
  try {
    console.log('Récupération des abonnés newsletter depuis Firestore...');
    
    // Get all newsletter subscribers
    const subscribersRef = db.collection('newsletter');
    const snapshot = await subscribersRef.orderBy('createdAt', 'asc').get();
    
    if (snapshot.empty) {
      console.log('Aucun abonné trouvé dans la collection newsletter.');
      return;
    }
    
    console.log(`Trouvé ${snapshot.size} entrées newsletter au total.`);
    
    // Track the first registration date
    let firstRegistrationDate = null;
    
    // Track all unique emails to avoid counting duplicates
    const allUniqueEmails = new Set();
    
    // Track weekly counts
    const weeklyCounts = {};
    
    // Store emails by week for detailed reporting
    const emailsByWeek = {};
    
    // Map to store week number to week label (including dates)
    const weekLabels = {};
    
    // Process each document
    snapshot.forEach(doc => {
      const data = doc.data();
      const email = data.email?.toLowerCase().trim(); // Normalize emails
      
      // Skip if no email
      if (!email) {
        console.log(`Document ${doc.id} ignoré - aucun email trouvé`);
        return;
      }
      
      const timestamp = data.createdAt?.toDate() || new Date(); // Default to current date if missing
      
      // Set the first registration date if not set
      if (!firstRegistrationDate) {
        firstRegistrationDate = timestamp;
        console.log(`Date du premier abonnement: ${firstRegistrationDate.toISOString().split('T')[0]}`);
      }
      
      // Calculate which week this registration belongs to (0-indexed)
      const weeksSinceStart = Math.floor((timestamp - firstRegistrationDate) / (7 * 24 * 60 * 60 * 1000));
      const weekNum = weeksSinceStart + 1; // 1-indexed for readability
      
      // Create a label for this week if we haven't yet
      if (!weekLabels[weekNum]) {
        const dates = getWeekDates(firstRegistrationDate, weekNum);
        weekLabels[weekNum] = `Semaine ${weekNum} (${dates.start} au ${dates.end})`;
      }
      
      const weekKey = weekLabels[weekNum];
      
      // Initialize arrays if needed
      if (!emailsByWeek[weekKey]) {
        emailsByWeek[weekKey] = [];
      }
      
      // Only count if this email hasn't been seen before
      if (!allUniqueEmails.has(email)) {
        // Add to the set of all unique emails
        allUniqueEmails.add(email);
        
        // Add to the list of emails for this week
        emailsByWeek[weekKey].push(email);
        
        // Increment the count for this week
        weeklyCounts[weekKey] = (weeklyCounts[weekKey] || 0) + 1;
      }
    });
    
    // Format the results
    console.log('\nInscriptions d\'emails uniques par semaine:');
    console.log('----------------------------------');
    
    const sortedWeeks = Object.keys(weeklyCounts).sort((a, b) => {
      const weekNumA = parseInt(a.split(' ')[1]);
      const weekNumB = parseInt(b.split(' ')[1]);
      return weekNumA - weekNumB;
    });
    
    let totalEmails = 0;
    sortedWeeks.forEach(week => {
      const count = weeklyCounts[week];
      totalEmails += count;
      console.log(`${week}: ${count} nouveaux emails uniques (Total: ${totalEmails})`);
    });
    
    console.log('----------------------------------');
    console.log(`Total des emails uniques: ${allUniqueEmails.size}`);
    
    // Write summary to CSV file
    let csvContent = 'Semaine,Nouveaux Emails Uniques,Total Emails Uniques\n';
    let runningTotal = 0;
    
    sortedWeeks.forEach(week => {
      const count = weeklyCounts[week];
      runningTotal += count;
      csvContent += `${week},${count},${runningTotal}\n`;
    });
    
    const csvPath = path.join(__dirname, 'emails-uniques-resume.csv');
    fs.writeFileSync(csvPath, csvContent);
    console.log(`Rapport résumé sauvegardé: ${csvPath}`);
    
    // Write detailed report with actual emails
    let detailedCsvContent = 'Semaine,Email\n';
    
    sortedWeeks.forEach(week => {
      const emails = emailsByWeek[week] || [];
      emails.forEach(email => {
        detailedCsvContent += `${week},"${email}"\n`;
      });
    });
    
    const detailedCsvPath = path.join(__dirname, 'emails-uniques-detaille.csv');
    fs.writeFileSync(detailedCsvPath, detailedCsvContent);
    console.log(`Rapport détaillé sauvegardé: ${detailedCsvPath}`);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnés newsletter:', error);
  }
}

// Run the function
countUniqueEmailsPerWeek().then(() => {
  console.log('Script terminé.');
}).catch(err => {
  console.error('Échec du script:', err);
});
