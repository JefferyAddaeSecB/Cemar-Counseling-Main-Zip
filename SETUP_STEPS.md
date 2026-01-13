# CEMAR Counseling - Firebase & Google Auth Setup Guide

## PHASE 1: Firebase Project Creation (5-10 minutes)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name: "CEMAR Counseling"
4. Disable Google Analytics (optional, for now)
5. Click "Create project"
6. Wait for project to initialize

### Step 2: Enable Authentication Services
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable these providers:
   - ✅ **Google** (for Google Sign-In)
   - ✅ **Email/Password** (for traditional login)
3. Add authorized domains (localhost:5174 for testing, your domain in production)

### Step 3: Enable Firestore Database
1. Go to **Firestore Database**
2. Click "Create Database"
3. Select **Start in production mode**
4. Choose region closest to you (default is fine)
5. Click "Enable"

### Step 4: Enable Realtime Database
1. Go to **Realtime Database**
2. Click "Create Database"
3. Select your region
4. Start in **locked mode** (we'll set security rules)
5. Click "Enable"

### Step 5: Get Your Credentials
1. Go to **Project Settings** (gear icon)
2. Go to **Service Accounts** tab
3. Under "Your apps" section, find your Web app
4. Click the copy icon next to the Firebase config
5. Save these values

---

## PHASE 2: Configure Environment Variables (2 minutes)

### Create `.env.local` file
In your project root, create `.env.local`:

```env
# Firebase Configuration (from Project Settings)
VITE_FIREBASE_API_KEY=AIzaXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=cemar-counseling-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cemar-counseling-xxxx
VITE_FIREBASE_STORAGE_BUCKET=cemar-counseling-xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_DATABASE_URL=https://cemar-counseling-xxxx.firebaseio.com

# Google OAuth
VITE_GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
```

**IMPORTANT:** 
- Never commit `.env.local` to Git (it's in `.gitignore`)
- These are your secrets - keep them safe!

---

## PHASE 3: Set Firestore Security Rules (5 minutes)

### 1. Go to Firestore Rules
1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace the default rules with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Clients can only read their own data
    match /clients/{clientId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }

    // Appointments: Read by involved parties
    match /appointments/{appointmentId} {
      allow read: if request.auth.uid == resource.data.clientId || 
                     request.auth.uid == resource.data.therapistId;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.clientId;
    }

    // Sessions: Only therapist and client
    match /sessions/{sessionId} {
      allow read: if request.auth.uid == resource.data.clientId || 
                     request.auth.uid == resource.data.therapistId;
      allow write: if request.auth.uid == resource.data.therapistId;
    }

    // Payments
    match /payments/{paymentId} {
      allow read, write: if request.auth.uid == resource.data.clientId;
    }

    // Communications (system logs)
    match /communications/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Therapists public listing
    match /therapists/{therapistId} {
      allow read: if true;
      allow write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click "Publish"

---

## PHASE 4: Set Realtime Database Security Rules (3 minutes)

### 1. Go to Realtime Database Rules
1. In Firebase Console, go to **Realtime Database** → **Rules**
2. Replace with:

```json
{
  "rules": {
    "webhooks": {
      ".read": false,
      ".write": "root.child('users').child(auth.uid).exists()",
      "appointment_created": {
        ".indexOn": ["$appointmentId"]
      },
      "appointment_completed": {
        ".indexOn": ["$appointmentId"]
      },
      "client_created": {
        ".indexOn": ["$clientId"]
      }
    },
    "appointments": {
      "$appointmentId": {
        ".read": "root.child('appointments').child($appointmentId).child('clientId').val() === auth.uid || root.child('appointments').child($appointmentId).child('therapistId').val() === auth.uid",
        ".write": "auth != null"
      }
    },
    ".read": false,
    ".write": false
  }
}
```

3. Click "Publish"

---

## PHASE 5: Initialize Collections in Firestore (2 minutes)

### Create Initial Collections
1. In Firestore, click **Start collection**
2. Create these empty collections (they'll populate when users sign up):
   - `users`
   - `clients`
   - `therapists`
   - `appointments`
   - `sessions`
   - `payments`
   - `communications`

---

## PHASE 6: Test Firebase Configuration

### 1. Test Environment Variables
```bash
npm run dev
```

Open browser console and you should see no Firebase errors.

### 2. Test Google Sign-In
1. Go to your login page
2. Add a "Sign in with Google" button (we'll add this next)
3. Click it and complete Google OAuth flow
4. Check Firebase Console → Authentication → Users (you should see yourself listed)

### 3. Verify Firestore Entry
1. After signing in, go to Firebase Console → Firestore Database
2. Check the `users` collection
3. You should see a document with your UID containing your profile data

---

## PHASE 7: Create Google Sign-In Component (Next Step)

After confirming Firebase works, we'll create a React component like:

```tsx
import { signInWithGoogle } from '@/lib/auth-helpers'

export function GoogleSignInButton() {
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle()
      console.log("Signed in:", user)
      // Redirect to dashboard
    } catch (error) {
      console.error("Sign in failed:", error)
    }
  }

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  )
}
```

---

## PHASE 8: n8n Automation Setup (Future)

Once Firebase is working, you can set up n8n workflows:

1. **Webhook Trigger** → Firebase Realtime DB
   - Trigger: New appointment created
   - Action: Send confirmation email

2. **Scheduled Trigger** → 24 hours before appointment
   - Action: Send reminder SMS/Email

3. **Database Trigger** → Appointment completed
   - Action: Send follow-up survey

---

## Troubleshooting

### ❌ "Firebase is not defined"
- Make sure `VITE_FIREBASE_API_KEY` is set in `.env.local`
- Restart dev server: `npm run dev`

### ❌ "Authentication provider not enabled"
- Check Firebase Console → Authentication → Sign-in method
- Ensure Google provider is enabled

### ❌ "Firestore rules rejected"
- Check Browser Console for specific rule error
- Verify `request.auth.uid` matches user UID
- Test with less restrictive rules first

### ❌ "CORS error"
- Make sure your domain is in Firebase → Authentication → Authorized domains

---

## Summary

✅ Phase 1: Firebase Project Created  
✅ Phase 2: Environment Variables Configured  
✅ Phase 3: Firestore Rules Set  
✅ Phase 4: Realtime Database Rules Set  
✅ Phase 5: Collections Initialized  
✅ Phase 6: Firebase Tested  
⏳ Phase 7: Google Sign-In Component (Next)  
⏳ Phase 8: n8n Workflows (After login works)

**Next command:** Let me know when you've completed Phases 1-6 and I'll create the Google Sign-In button!
