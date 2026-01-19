# Firebase Cloud Functions Configuration

## Calendly API Integration

The scheduled function `syncCalendlyEvents` needs your Calendly API token.

### Environment Variables Required

Add to your `.env` or deploy with:

```bash
firebase functions:config:set calendly.api_token="YOUR_TOKEN"
```

Or add to `.firebaserc` or use Firebase Secrets:

```bash
firebase functions:secrets:set CALENDLY_API_TOKEN
# Then paste your token when prompted
```

### How It Works

1. **Scheduled Execution:** Every 10 minutes
   - Connects to Calendly API with your token
   - Fetches events from last 60 days
   - Syncs to Firestore `appointments` collection

2. **Firestore Schema:**
   ```
   appointments/{eventId}
   ├── eventId: string (Calendly event ID)
   ├── calendlyUri: string (full Calendly URI)
   ├── inviteeEmail: string (invitee email/name)
   ├── startTime: Timestamp
   ├── endTime: Timestamp
   ├── status: string ("scheduled" | "cancelled" | "completed")
   ├── updatedAt: Timestamp
   └── source: string ("calendly_poll")
   ```

3. **Stats Calculation:**
   - Runs after every sync
   - Stores in `stats/global`:
     ```
     totalBookings: number
     upcomingBookings: number (startTime > now AND status = scheduled)
     cancelledBookings: number
     lastSync: Timestamp
     ```

4. **Auto-Complete Past Appointments:**
   - Runs every 5 minutes
   - Marks appointments with startTime <= now as "completed"

### Token Setup

Your Calendly token is stored securely in Firebase Secrets.

To view/update:
```bash
firebase functions:secrets:get CALENDLY_API_TOKEN
firebase functions:secrets:set CALENDLY_API_TOKEN  # to update
```

### Deployment

```bash
firebase deploy --only functions:syncCalendlyEvents,functions:markPastAppointmentsCompleted
```

### Testing Locally

```bash
# Run emulator
firebase emulators:start --only functions

# View logs
firebase functions:log
```

### API Costs

- ✅ Works with Calendly Free plan
- ✅ No webhook fees
- ✅ Efficient: only syncs changed events
- ✅ Firebase Blaze plan charges per invocation

### Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Token is wrong or expired - update it |
| No events synced | Check Calendly token is valid |
| Missing stats | Check Firestore permissions |

