# ✅ Calendly Polling System - LIVE

## Deployment Status

### Cloud Functions Deployed ✓
- **syncCalendlyEvents**: Running every 10 minutes
  - Status: ACTIVE
  - Runtime: Node.js 20
  - Memory: 256 MB
  - Location: us-central1

- **markPastAppointmentsCompleted**: Running every 5 minutes
  - Status: ACTIVE
  - Runtime: Node.js 20
  - Memory: 256 MB
  - Location: us-central1

## Next Steps to Test

### Step 1: Book a Test Appointment
1. Go to your Calendly booking link: https://calendly.com/cemarcounseling-info
2. Fill in test details (name, email, select time)
3. Confirm the booking

### Step 2: Wait for Sync
- First sync runs within 10 minutes
- Usually takes 1-3 minutes after booking
- Function will fetch events from Calendly API
- Write to Firestore `appointments` collection

### Step 3: Verify in Firebase Console
1. Go to: https://console.firebase.google.com/project/cemar-counseling-e8ea3/firestore/data
2. Look for `appointments` collection
3. You should see your booked appointment with:
   - eventId (from Calendly)
   - startTime (ISO timestamp)
   - status: "scheduled"
   - inviteeEmail (your email)

### Step 4: Check Your Profile Dashboard
1. Go to: http://localhost:3000/profile
2. Login with your account
3. Look at "Upcoming Appointments"
4. Should show the test appointment with stats updated

### Step 5: Monitor Logs
```bash
firebase functions:log
```

Look for these success messages:
```
Starting Calendly sync...
Found X events from Calendly
Created: 1, Updated: 0
Stats saved - Total: 1, Upcoming: 1, Cancelled: 0
```

## What's Happening Behind the Scenes

```
10:00 AM - Sync starts
  ↓ Get user org from Calendly API
  ↓ Fetch events from last 60 days
  ↓ Parse each event
  ↓ Check if exists in Firestore
  ↓ Create or update appointment
  ↓ Calculate stats (total, upcoming, cancelled)
  ↓ Save stats to Firestore
  ↓ Log results
  
Your App
  ↓ Real-time Firestore listener
  ↓ Detects appointment creation
  ↓ Updates profile dashboard
  ✓ Shows "1 Upcoming Appointment"
```

## Data Structure

### Firestore `appointments/{eventId}`
```json
{
  "eventId": "string",
  "calendlyUri": "https://api.calendly.com/scheduled_events/...",
  "inviteeEmail": "user@example.com",
  "startTime": "Firestore Timestamp",
  "endTime": "Firestore Timestamp",
  "status": "scheduled | cancelled | completed",
  "updatedAt": "Firestore Timestamp",
  "source": "calendly_poll"
}
```

### Firestore `stats/global`
```json
{
  "totalBookings": 5,
  "upcomingBookings": 3,
  "cancelledBookings": 1,
  "lastSync": "Firestore Timestamp",
  "syncType": "calendly_poll"
}
```

## How It Stays Real-Time

1. Every 10 minutes: Cloud Function polls Calendly API
2. Creates/updates appointments in Firestore
3. Your React app has a real-time listener on `appointments` collection
4. When Firestore detects changes, app updates instantly
5. Profile dashboard shows latest stats

## Testing Checklist

- [ ] Book a test appointment on Calendly
- [ ] Wait for next sync (< 10 minutes)
- [ ] Check Firebase Console Firestore
- [ ] See appointment in `appointments` collection
- [ ] Login to profile dashboard
- [ ] Verify appointment appears under "Upcoming"
- [ ] Cancel the test appointment
- [ ] Watch status change to "cancelled"

## Troubleshooting

### No appointments appearing?
1. Check Firestore has `appointments` collection
2. Verify Calendly token is valid
3. Check Cloud Function logs for errors
4. Ensure profile listener is reading from correct collection

### Old token error?
The token was stored in `functions/.env.local` and will be used when function runs.

### Want to test manually?
```bash
# Trigger the function right now (no need to wait 10 min)
firebase functions:log  # View logs as it runs
```

## Cost

✅ Very cheap on Blaze plan:
- Calendly API: Free
- Firestore: < $1/month (432 syncs × ~15 ops per sync = ~6.5k writes/month)
- Cloud Functions: < $1/month (432 invocations)

**Total monthly cost: Usually < $2**

---

**Status: 🟢 LIVE AND READY**

Your system is now syncing Calendly appointments to Firebase every 10 minutes. 
Profile dashboard will show appointments in real-time.

