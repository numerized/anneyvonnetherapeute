# Newsletter Subscribers Unique Email Counter

This script analyzes the Firestore `newsletter` collection to count unique email registrations on a weekly basis. It generates both summary and detailed reports as CSV files.

## Prerequisites

1. Firebase Admin SDK
2. A Firebase Service Account key file

## Setup

1. Install the required dependencies:
   ```bash
   npm install firebase-admin
   ```

2. Get your Firebase service account key:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Click on the gear icon (⚙️) > Project settings > Service accounts
   - Click "Generate new private key"
   - Save the JSON file as `firebase-service-account.json` in the `scripts` directory

3. Replace the placeholder file with your actual service account key:
   ```bash
   mv your-downloaded-key.json scripts/firebase-service-account.json
   ```

## Usage

Run the script from the project root:

```bash
node scripts/count-unique-emails.js
```

## Output

The script generates two files:

1. `unique-emails-summary.csv`: Contains weekly counts of new unique emails and running totals
2. `unique-emails-detailed.csv`: Contains all unique email addresses organized by week

The script also prints a summary to the console.

## How It Works

- The script fetches all newsletter entries from Firestore
- It sorts them by creation date and identifies the first registration date
- Each email is counted only once (when first registered)
- Emails are grouped into weeks starting from the first registration date
- Results are displayed and saved to CSV files

## Notes

- Email addresses are normalized (converted to lowercase and trimmed)
- The website domain used in the script is https://coeur-a-corps.org
