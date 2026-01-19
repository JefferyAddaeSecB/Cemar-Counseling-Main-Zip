# Calendly Polling Cloud Functions - Deployment Guide

## Overview

This is a **simple, cost-effective** approach to sync Calendly appointments to Firebase without webhooks.

**How it works:**
- Every 10 minutes: Cloud Function polls Calendly API for events
- Syncs to Firestore `appointments` collection
- Calculates stats (total, upcoming, cancelled)
- Auto-marks past appointments as completed

**Advantages:**
✅ Works with Calendly Free plan (no webhooks needed)
✅ No payment for webhook infrastructure  
✅ Simple, maintainable code
✅ Efficient Firestore operations
✅ Profile updates automatically from Firestore listener

---

## Prerequisites

1. Firebase project on **Blaze plan** (for Cloud Functions)
2. Calendly Professional account or higher
3. Your Calendly Personal Access Token (already stored in `functions/.env.local`)

---

## Step 1: Verify Setup

Check that everything is in place:

```bash
cd /Users/jefferyaddae/Desktop/CEMAR\ Counseling/cemar-counselling-main

# Check functions code
cat functions/index.js | head -20

# Check token is set
cat functions/.env.local
```

---

## Step 2: Deploy Cloud Functions

Deploy the two scheduled functions:

```bash
firebase deploy --only functions:syncCalendlyEvents,functions:markPastAppointmentsCompleted
```

**Expected output:**
```
✔ Deploy complete!

Function URL (syncCalendlyEvents): [function URL]
Function URL (markPastAppointmentsCompleted): [function URL]
```

The functions are now live and will:
- `syncCalendlyEvents`: Run every 10 minutes
- `markPastAppointmentsCompleted`: Run every 5 minutes

---

## Step 3: Monitor Cloud Functions

View logs to confirm functions are working:

```bash
firebase functions:log
```

**Expected logs after 10 minutes:**
```
Starting Calendly sync...
Found user: https://api.calendly.com/users/203c518c-6aea-41cc-be62-6b88303261c6
Organization: https://api.calendly.com/organizations/dba1e2d4-a149-4c0d-9a9b-ebf5e3f2a961
Found X events from Calendly
Created: Y, Updated: Z
Stats saved - Total: X, Upcoming: Y, Cancelled: Z
```

---

## Step 4: Verify Firestore Collections

Go to Firebase Console and check:

```
https://console.firebase.google.com/project/cemar-counseling-e8ea3/firestore/data
```

You should see two collections:

### `appointments/`
Each document has:
- `eventId` (string)
- `startTime` (timestamp)
- `endTime` (timestamp)
- `status` ("scheduled" | "cancelled" | "completed")
- `inviteeEmail` (string)
- `updatedAt` (timestamp)

### `stats/global`
Contains:
- `totalBookings` (number)
- `upcomingBookings` (number)
- `cancelledBookings` (number)
- `lastSync` (timestamp)

---

## Step 5: Test with Real Booking

1. **Book an appointment through your Calendly link**
   - Go to: https://calendly.com/cemarcounseling-info
   - Fill in details and schedule

2. **Wait for sync** (max 10 minutes, usually 1-2)

3. **Check Firestore** for the new appointment

4. **Check your profile dashboard**
   - Go to: http://localhost:3000/profile
   - Login with your account
   - Should see appointment under "Upcoming Appointments"

---

## Step 6: Environment Setup for Production

When deploying to production, set the Calendly token:

### Option A: Via Firebase Config

```bash
firebase functions:config:set calendly.token="YOUR_TOKEN"
```

Then update `functions/index.js`:
```javascript
const CALENDLY_API_TOKEN = functions.config().calendly.token || process.env.CALENDLY_API_TOKEN
```

### Option B: Via .env (Development)

Token is already in `functions/.env.local`

### Option C: Via Vercel/Cloud Run Secrets

Set environment variable:
```
CALENDLY_API_TOKEN=your_token_here
```

---

## Firestore Data Flow

```
Calendly Events
    ↓
Cloud Function (every 10 min)
    ↓
Calendly API call
    ↓
Extract event details
    ↓
Firestore appointments collection
    ↓
Calculate stats → save to stats/global
    ↓
Your app (Firestore real-time listener)
    ↓
Profile updates automatically!
```

---

## Cost Estimate (Blaze Plan)

**Per sync cycle (10 minutes):**
- 1 API call to Calendly (free)
- ~5 Firestore reads (events check)
- ~3 Firestore writes (appointments + stats)
- ~100 Firestore reads (calculate stats)

**Monthly:** ~432 syncs × 10 reads + 3 writes = ~4,608 reads + 1,296 writes

**Cost:** Usually **< $1/month** on Firestore free tier (50k reads/day, 20k writes/day)

---

## Troubleshooting

### Function not running

```bash
# Check if scheduled functions are enabled
firebase functions:config:get

# View detailed logs
firebase functions:log --limit 100
```

### No events syncing

1. Check Calendly token is valid
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" https://api.calendly.com/users/me
   ```

2. Check Calendly account has events
   - Go to: https://calendly.com/app/calendar

3. Check Firestore permissions
   - Firebase Console → Firestore → Rules

### Events not appearing in profile

1. Check Firestore `appointments` collection exists
2. Verify Firestore listener in profile component is active
3. Click "Refresh" button on profile page
4. Check browser console for JavaScript errors

---

## Monitoring & Alerts

Add custom monitoring:

```javascript
// In functions/index.js, after successful sync:
await db.collection('system_logs').add({
  timestamp: admin.firestore.Timestamp.now(),
  function: 'syncCalendlyEvents',
  status: 'success',
  eventsCount: calendlyEvents.length,
  created,
  updated,
})
```

Then create alerts in Firebase Cloud Monitoring.

---

## Updating the Token

If your Calendly token expires or you need to rotate it:

1. Generate new token in Calendly: https://calendly.com/app/integrations/api
2. Update `functions/.env.local`:
   ```
   CALENDLY_API_TOKEN=new_token_here
   ```
3. Redeploy:
   ```bash
   firebase deploy --only functions:syncCalendlyEvents
   ```

---

## Next Steps

✅ Verify Blaze plan is active
✅ Deploy Cloud Functions
✅ Monitor logs for 10 minutes
✅ Book test appointment
✅ Verify in Firestore
✅ Check profile dashboard
✅ Share Calendly link with clients!

---

## Support

If you hit issues:
1. Check Firebase Console → Cloud Functions → Logs
2. Verify Calendly token is valid
3. Check Firestore permissions
4. Test API manually with curl
5. Check function timeout (default 60s is fine)

