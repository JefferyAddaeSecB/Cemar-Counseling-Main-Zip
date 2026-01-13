# Firebase Database Setup for CEMAR Counseling

## Overview
This document outlines the database structure for CEMAR Counseling using Firebase Realtime Database and Firestore. This setup enables n8n automation for appointment notifications, client management, and workflow triggers.

---

## Firebase Configuration

### Step 1: Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project named "CEMAR Counseling"
3. Enable these services:
   - Authentication (Google Sign-In)
   - Realtime Database
   - Firestore Database
4. Copy your Web SDK credentials

### Step 2: Set Environment Variables
Create a `.env.local` file in your project root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

---

## Database Schema

### Firestore Collections

#### 1. `users` Collection
Stores client and therapist user profiles

```
users/
├── {userId}
│   ├── email: string
│   ├── name: string
│   ├── phone: string
│   ├── role: "client" | "therapist" | "admin"
│   ├── avatar: string (URL)
│   ├── createdAt: timestamp
│   ├── lastLogin: timestamp
│   └── preferences
│       ├── notificationsEnabled: boolean
│       └── sessionReminders: "email" | "sms" | "both"
```

#### 2. `clients` Collection
Extended client information for counseling

```
clients/
├── {clientId}
│   ├── userId: string (reference to users collection)
│   ├── dateOfBirth: date
│   ├── address: string
│   ├── emergencyContact: string
│   ├── insuranceProvider: string
│   ├── intake
│   │   ├── completedAt: timestamp
│   │   ├── mainConcerns: string[]
│   │   └── referralSource: string
│   ├── status: "active" | "inactive" | "paused"
│   └── notes: string
```

#### 3. `therapists` Collection
Therapist/Counselor profiles

```
therapists/
├── {therapistId}
│   ├── userId: string (reference to users collection)
│   ├── license: string
│   ├── specializations: string[]
│   ├── availableHours
│   │   ├── monday: { start: "09:00", end: "17:00" }
│   │   ├── tuesday: { start: "09:00", end: "17:00" }
│   │   └── ... (rest of week)
│   ├── bio: string
│   ├── hourlyRate: number
│   └── maxClientsPerWeek: number
```

#### 4. `appointments` Collection
Booking records for n8n automation triggers

```
appointments/
├── {appointmentId}
│   ├── clientId: string (reference to clients)
│   ├── therapistId: string (reference to therapists)
│   ├── startTime: timestamp
│   ├── endTime: timestamp
│   ├── serviceType: "individual" | "couples" | "group" | "free15min"
│   ├── status: "booked" | "completed" | "cancelled" | "no-show"
│   ├── sessionNotes: string
│   ├── followUpNeeded: boolean
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

#### 5. `sessions` Collection
Session records and notes (after appointment completion)

```
sessions/
├── {sessionId}
│   ├── appointmentId: string (reference to appointments)
│   ├── clientId: string
│   ├── therapistId: string
│   ├── sessionDate: timestamp
│   ├── duration: number (minutes)
│   ├── notes: string (confidential)
│   ├── goals: string[]
│   ├── nextSteps: string[]
│   ├── homework: string
│   ├── moodRating: number (1-10)
│   └── recordedAt: timestamp
```

#### 6. `payments` Collection
Payment records for tracking

```
payments/
├── {paymentId}
│   ├── clientId: string
│   ├── appointmentId: string
│   ├── amount: number
│   ├── currency: "USD"
│   ├── status: "pending" | "completed" | "failed" | "refunded"
│   ├── paymentMethod: "stripe" | "paypal"
│   ├── transactionId: string
│   ├── createdAt: timestamp
│   └── completedAt: timestamp
```

#### 7. `communications` Collection
Email/SMS logs for n8n automation tracking

```
communications/
├── {communicationId}
│   ├── clientId: string
│   ├── type: "email" | "sms" | "reminder" | "confirmation"
│   ├── subject: string
│   ├── body: string
│   ├── sentAt: timestamp
│   ├── status: "sent" | "failed" | "bounced"
│   ├── relatedAppointmentId: string
│   └── automatedBy: "n8n" | "manual"
```

---

## Realtime Database Structure (for n8n Webhooks)

For real-time triggers in n8n, use this structure:

```
/webhooks/
├── appointment_created/
│   └── {appointmentId}: timestamp (triggers new booking workflow)
├── appointment_cancelled/
│   └── {appointmentId}: timestamp (triggers cancellation workflow)
├── appointment_completed/
│   └── {appointmentId}: timestamp (triggers post-session workflow)
└── client_created/
    └── {clientId}: timestamp (triggers welcome workflow)
```

---

## n8n Automation Workflows

### 1. New Appointment Webhook Trigger
- **Trigger:** When record added to `/webhooks/appointment_created`
- **Actions:**
  - Send confirmation email to client
  - Send calendar invitation to therapist
  - Add to Google Calendar
  - Send appointment reminder SMS

### 2. Appointment Reminder Workflow
- **Trigger:** Scheduled (24 hours before appointment)
- **Actions:**
  - Query `appointments` collection
  - Filter appointments for tomorrow
  - Send email reminders to clients
  - Log communication in `communications` collection

### 3. Post-Session Workflow
- **Trigger:** Appointment marked as completed
- **Actions:**
  - Generate session summary
  - Send follow-up email
  - Request client feedback
  - Create next appointment reminder
  - Log in `communications` collection

### 4. Payment Processing Workflow
- **Trigger:** New appointment booked
- **Actions:**
  - Create payment record
  - Process Stripe/PayPal charge
  - Update payment status
  - Send receipt email

---

## Security Rules

### Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Therapists can read client lists, clients can only read their own
    match /clients/{clientId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if request.auth.uid == resource.data.userId;
    }

    // Appointments: Read by client/therapist, write by authenticated users
    match /appointments/{appointmentId} {
      allow read: if request.auth.uid == resource.data.clientId || 
                     request.auth.uid == resource.data.therapistId;
      allow write: if request.auth != null;
    }

    // Sessions: Only therapist and client can read
    match /sessions/{sessionId} {
      allow read: if request.auth.uid == resource.data.clientId || 
                     request.auth.uid == resource.data.therapistId;
      allow write: if request.auth.uid == resource.data.therapistId;
    }
  }
}
```

### Realtime Database Rules
```json
{
  "rules": {
    "webhooks": {
      ".read": false,
      ".write": "root.child('users').child(auth.uid).exists()"
    },
    "appointments": {
      "$appointmentId": {
        ".read": "root.child('appointments').child($appointmentId).child('clientId').val() === auth.uid || root.child('appointments').child($appointmentId).child('therapistId').val() === auth.uid",
        ".write": "auth != null"
      }
    }
  }
}
```

---

## Next Steps

1. **Create Firebase Project** - Complete Google Cloud setup
2. **Initialize Collections** - Add structure to Firestore
3. **Set Environment Variables** - Configure `.env.local`
4. **Implement Google Auth** - Update auth helpers
5. **Set Security Rules** - Apply Firestore/Realtime Database rules
6. **Create n8n Workflows** - Set up automation triggers
7. **Test End-to-End** - Verify bookings → automations

---

## Useful Firebase CLI Commands

```bash
# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# View real-time logs
firebase functions:log
```

---

## References
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [n8n Firebase Integration](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.firebase/)
