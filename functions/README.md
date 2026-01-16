# Cloud Functions for Cemar Counseling

This folder contains a scheduled Cloud Function that marks past appointments as `completed`.

Deploy steps:

1. Install Firebase CLI if you don't have it:

```bash
npm install -g firebase-tools
```

2. Authenticate and select your project:

```bash
firebase login
firebase projects:list
firebase use <your-firebase-project-id>
```

3. From this `functions` folder, install dependencies and deploy:

```bash
cd functions
npm install
cd ..
firebase deploy --only functions:markPastAppointmentsCompleted
```

Notes:
- The scheduled function runs in Google Cloud (via Cloud Scheduler) and will require billing enabled on the Firebase/GCP project for scheduled functions.
- You can change schedule frequency in `index.js`.
