# Calendly + Firebase Real-Time Integration Setup

This guide explains how to connect Calendly to Firebase so appointments automatically sync to your profile dashboard in real-time.

## Overview

When someone books an appointment through Calendly:
1. Calendly sends a webhook to your Firebase Cloud Function
2. The function parses the event data and stores it in Firestore
3. Your profile page displays the appointment in real-time via Firestore listeners

## Prerequisites

- Calendly account (Professional plan or higher required for webhooks)
- Firebase project deployed with the `calendlyWebhook` Cloud Function
- Webhook URL from your deployed Cloud Function

## Step 1: Deploy the Calendly Webhook Function

First, upgrade your Firebase project to **Blaze (pay-as-you-go)** plan:
1. Go to https://console.firebase.google.com/project/cemar-counseling-e8ea3/usage/details
2. Click **Upgrade to Blaze**

Then deploy the webhook function:
```bash
firebase deploy --only functions:calendlyWebhook
```

After deployment, you'll see output with the function URL:
```
Function URL (calendlyWebhook(us-central1)): https://us-central1-cemar-counseling-e8ea3.cloudfunctions.net/calendlyWebhook
```

**Save this URL** - you'll need it for Calendly.

## Step 2: Set Up Calendly Webhook

1. Go to [Calendly Settings](https://calendly.com/app/settings)
2. Navigate to **Integrations** → **Webhooks**
3. Click **Add Webhook**
4. Fill in the details:
   - **Endpoint URL**: Paste the Cloud Function URL from Step 1
   - **Events**: Select these events:
     - ✓ `invitee.created` (when someone books)
     - ✓ `invitee.canceled` (when someone cancels)
5. Click **Create Webhook**

Calendly will send a test webhook to verify the URL is working. If successful, you'll see a green checkmark.

## Step 3: Test the Integration

1. Book a test appointment through your Calendly link
2. Go to your CEMAR profile page
3. The appointment should appear in **Upcoming Appointments** within seconds
4. Click the **Refresh** button if needed to force a sync

## Data Structure

Appointments are stored in Firestore with this structure:

```
appointments/
├── {appointmentId}
│   ├── appointmentId: string (Calendly event ID)
│   ├── calendlyEventId: string (full Calendly event URI)
│   ├── clientEmail: string (client's email from Calendly)
│   ├── clientName: string (client's full name)
│   ├── serviceTitle: string (event title from Calendly)
│   ├── serviceKey: string (event type name)
│   ├── startTime: Timestamp (appointment start)
│   ├── endTime: Timestamp (appointment end)
│   ├── timezone: string (client's timezone)
│   ├── status: string ("upcoming" | "completed" | "cancelled")
│   ├── clientId: string (client email, used to filter by user)
│   ├── createdAt: Timestamp (when appointment was created)
│   └── source: string ("calendly")
```

## How It Works

### When Someone Books (invitee.created)
- Calendly sends event data with client info and appointment details
- Cloud Function extracts: email, name, start/end times, timezone
- Checks if appointment already exists (deduplication)
- Creates new appointment in Firestore with status "upcoming"
- Profile page updates in real-time via Firestore listener

### When Someone Cancels (invitee.canceled)
- Calendly sends cancellation event
- Cloud Function finds matching appointment by Calendly event URI
- Updates appointment status to "cancelled"
- Profile page updates to remove from upcoming list

### Auto-Completion (Scheduled Function)
- Every 5 minutes, a Cloud Function checks for past appointments
- Any appointment with startTime <= now is marked as "completed"
- Profile page automatically moves completed appointments to Past section

## Troubleshooting

### Webhook Not Being Called
- Verify the Endpoint URL in Calendly settings is correct
- Check Cloud Function logs in Firebase Console
- Ensure your Firebase project is on Blaze plan

### Appointments Not Appearing
- Click **Refresh** on the profile page
- Check Firestore in Firebase Console → appointments collection
- Verify the appointment's `clientId` matches the logged-in user's email (currently set to invitee email)

### Deduplication Issues
- If same appointment appears multiple times, it means the `calendlyEventId` doesn't match
- Check the Firestore document to see what's stored
- Delete duplicate documents and re-test

## Optional: Linking Appointments to Authenticated Users

Currently, appointments use the client's email as `clientId`. To link to authenticated users:

1. In Calendly event form, add a custom question asking for account email
2. Modify the webhook handler to use that email as `clientId`
3. Adjust the profile page filter to match properly

## Support

For issues:
- Check Firebase Console → Cloud Functions logs
- Verify Calendly webhook delivery status in Calendly settings
- Test with a fresh appointment booking

