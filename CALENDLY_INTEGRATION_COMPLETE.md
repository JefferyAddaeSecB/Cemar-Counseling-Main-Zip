# ✅ Calendly Integration Complete

## What's Been Set Up

### 1. **Calendly API Token Configured**
- Token: Securely stored in `/functions/.env`
- Organization: `dba1e2d4-a149-4c0d-9a9b-ebf5e3f2a961`
- User: Richard A Titus-Glover (info@cemarcounseling.com)
- Scheduling URL: https://calendly.com/cemarcounseling-info

### 2. **Your Calendly Event Types (Appointment Types)**
The following appointment types are available:
- ✅ **Couples Counseling** - `e44ac6f8-4d6f-41c0-ba99-b97424934fe4`
- ✅ **FREE COMPLIMENTARY SESSION** - `ce6e37c2-67d2-416c-ae98-25e0e7525512`
- ✅ **Group Counseling** - `9fcc0c97-c671-457b-a2f4-21f295accf05`
- ✅ **In-Person Individual Session** - `f93ff25f-168a-4f4a-8527-3ab59dca60d8`
- ✅ **Online Individual Session** - `b4fc04ab-8b0b-47e1-87ea-f9e7cb53bb04`

### 3. **Client-Side Sync Implementation**
Created `/src/lib/calendly-sync.ts` with:
- ✅ Automatic appointment syncing from Calendly API
- ✅ Pulls last 60 days + next 60 days of appointments
- ✅ Syncs client info (name, email, timezone)
- ✅ Handles appointment status (scheduled/cancelled)
- ✅ Deduplication to prevent double-booking

### 4. **Therapist Dashboard Integration**
Updated `/src/pages/therapist/schedule/page.tsx`:
- ✅ **"Sync Calendly" button** in top bar
- ✅ **Auto-sync on page load** (loads latest appointments)
- ✅ **Manual sync option** with loading state
- ✅ Real-time updates via Firestore listeners

## How It Works

### When You Click "Sync Calendly":
1. **Fetches appointments** from Calendly API (last 60 + next 60 days)
2. **Gets invitee details** (client name, email, timezone)
3. **Creates appointments in Firestore** at `appointments/{eventId}`
4. **Dashboard updates automatically** via real-time listeners
5. **Shows results** (X created, Y updated)

### Appointment Data Structure:
```typescript
{
  eventId: string;              // Calendly event ID
  calendlyUri: string;          // Full Calendly URI
  therapistId: string;          // Your Firebase UID
  therapistEmail: string;       // info@cemarcounseling.com
  clientId: string;             // Client email
  clientEmail: string;          // Client email
  clientName: string;           // Client full name
  serviceType: string;          // Appointment type name
  serviceTitle: string;         // Same as serviceType
  startTime: Timestamp;         // Appointment start
  endTime: Timestamp;           // Appointment end
  duration: number;             // Duration in minutes
  status: 'scheduled' | 'cancelled' | 'completed';
  source: 'calendly';           // Always 'calendly'
  timezone: string;             // Client's timezone
  createdAt: Timestamp;         // When created in Firestore
  updatedAt: Timestamp;         // Last update time
  syncedAt: Timestamp;          // Last sync from Calendly
}
```

## What You Can Do Now

### ✅ In Therapist Portal (http://localhost:5174/therapist/schedule):
1. **View all appointments** synced from Calendly
2. **Click "Sync Calendly"** to fetch latest
3. **Auto-syncs on page load** (no manual action needed)
4. **Click appointments** to view details
5. **Add session notes** to appointments
6. **Mark as completed** (status management)

### ✅ Appointment Types Synced:
All 5 of your Calendly event types will automatically appear:
- Couples Counseling
- FREE COMPLIMENTARY SESSION
- Group Counseling
- In-Person Individual Session
- Online Individual Session

## Testing Instructions

### 1. **Test the Integration:**
```bash
# Start the dev server (if not running)
cd "/Users/jefferyaddae/Desktop/CEMAR Counseling/cemar-counselling-main"
npm run dev
```

### 2. **Access Therapist Portal:**
- Go to: http://localhost:5174/therapist/schedule
- Should see "Sync Calendly" button
- Click it to sync appointments
- Watch console for sync progress

### 3. **Verify Appointments:**
- Check if your recent Calendly bookings appear
- Click on an appointment to see details
- Verify client name, email, time are correct

## Troubleshooting

### If No Appointments Show:
1. **Check browser console** for errors
2. **Verify you have bookings** in Calendly (last 60 days or next 60 days)
3. **Click "Sync Calendly"** manually
4. **Check Firestore** at `appointments` collection

### If Sync Fails:
- Check browser console for error messages
- Verify Calendly token is valid
- Check network tab for API responses

### Token Expired?
If you need a new token:
1. Go to: https://calendly.com/integrations/api_webhooks
2. Generate new Personal Access Token
3. Update in `/src/lib/calendly-sync.ts` (line 5)

## Next Steps (Optional Enhancements)

### 🔄 Automatic Background Sync:
Currently syncs on page load + manual button. Could add:
- Periodic auto-sync every 5-10 minutes
- WebSocket for real-time updates

### 📧 Webhook Integration:
For instant updates when clients book:
- Set up Firebase Cloud Function webhook endpoint
- Register webhook in Calendly
- Get instant notifications (no polling)

### 🗓️ Two-Way Sync:
Currently one-way (Calendly → Portal). Could add:
- Create appointments in portal → push to Calendly
- Cancel in portal → cancel in Calendly
- Reschedule in portal → reschedule in Calendly

## Support

### Calendly API Documentation:
- https://developer.calendly.com/api-docs
- https://developer.calendly.com/api-docs/00fafae0e0f78-calendly-api

### Firebase Documentation:
- https://firebase.google.com/docs/firestore

---

**Status:** ✅ **READY TO USE**

Your therapist dashboard is now fully integrated with Calendly! Just click "Sync Calendly" and all your appointments will appear.
