# Complete Calendly Webhook & API Setup Guide

This guide shows you how to set up Calendly webhooks to send real-time booking data to Firebase using the **Calendly API** (recommended for developers).

---

## **Important: Two Methods to Set Up Webhooks**

### **Method 1: Calendly API (Recommended for Developers)** ← Use this
- Programmatic via API calls
- Full automation support
- Works in terminal/code

### **Method 2: Calendly Web UI (Manual)**
- Requires Professional+ plan
- Point-and-click setup
- Web interface only

**We'll use Method 1 (API)** since it's more reliable and gives you full control.

---

## **Prerequisites**

1. ✅ Calendly Professional or higher plan (required for webhooks)
2. ✅ Calendly Personal Access Token
3. ✅ Your organization URI or user URI
4. ✅ Firebase Cloud Function deployed with webhook endpoint
5. ✅ Terminal/curl access

---

## **Step 1: Generate Calendly Personal Access Token**

A Personal Access Token authenticates API requests to Calendly.

### **Via Calendly Web UI:**

1. **Go to Calendly API Settings:**
   - Visit: https://calendly.com/app/integrations/api
   - Or go to: Settings → Integrations → API

2. **Click "Create Token"** (or "Generate Token")

3. **Name the token:** (e.g., "Firebase Webhook Token")

4. **Save the token immediately** - you won't see it again!
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## **Step 2: Find Your Organization URI**

The Organization URI identifies which Calendly workspace to receive webhooks from.

### **Option A: Find via API (Easiest)**

Run this command to get your organization URI:

```bash
curl --request GET \
  --url https://api.calendly.com/users/me \
  --header 'Authorization: Bearer YOUR_TOKEN_HERE'
```

Replace `YOUR_TOKEN_HERE` with your token from Step 1.

**Look for this in the response:**
```json
{
  "resource": {
    "uri": "https://api.calendly.com/users/XXXXX",
    "organization": "https://api.calendly.com/organizations/YYYYYYY"
  }
}
```

**Copy the `organization` value** - you'll use it in Step 3.

### **Option B: Find via Web UI**

1. Go to: https://calendly.com/app/settings
2. Look for **"Organization ID"** or **"Workspace ID"** in integrations
3. Note the ID (format: usually alphanumeric)

---

## **Step 3: Get Your Firebase Webhook URL**

This is the endpoint where Calendly sends appointment data.

### **Deploy the Cloud Function First:**

```bash
cd /Users/jefferyaddae/Desktop/CEMAR\ Counseling/cemar-counselling-main
firebase deploy --only functions:calendlyWebhook
```

**After deployment, you'll see:**
```
Function URL (calendlyWebhook(us-central1)): 
https://us-central1-cemar-counseling-e8ea3.cloudfunctions.net/calendlyWebhook
```

**Copy this URL** - it's your webhook endpoint.

---

## **Step 4: Create Webhook Subscription via API**

Now you'll create the webhook subscription using Calendly's API.

### **Run this command** (all on one line or use the multi-line version):

```bash
curl --request POST \
  --url https://api.calendly.com/webhook_subscriptions \
  --header 'Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "url": "https://us-central1-cemar-counseling-e8ea3.cloudfunctions.net/calendlyWebhook",
    "events": ["invitee.created", "invitee.canceled"],
    "organization": "https://api.calendly.com/organizations/YOUR_ORG_ID"
  }'
```

**Replace these:**
- `YOUR_PERSONAL_ACCESS_TOKEN` → Token from Step 1
- `https://us-central1-cemar-counseling-e8ea3.cloudfunctions.net/calendlyWebhook` → Your Firebase URL from Step 3
- `YOUR_ORG_ID` → Organization URI from Step 2

### **Expected Response (Success):**
```json
{
  "resource": {
    "uri": "https://api.calendly.com/webhook_subscriptions/XXXXX",
    "callback_url": "https://us-central1-cemar-counseling-e8ea3.cloudfunctions.net/calendlyWebhook",
    "created_at": "2026-01-19T10:00:00Z",
    "updated_at": "2026-01-19T10:00:00Z",
    "events": [
      "invitee.created",
      "invitee.canceled"
    ],
    "state": "active"
  }
}
```

**If you see `"state": "active"`** → 🎉 Success! Your webhook is live!

### **Troubleshooting:**

| Error | Solution |
|-------|----------|
| `401 Unauthorized` | Token is invalid or expired |
| `404 Not Found` | Organization URI is wrong |
| `400 Bad Request` | URL format is incorrect |

---

## **Step 5: Verify Webhook is Active**

### **List all webhook subscriptions:**

```bash
curl --request GET \
  --url 'https://api.calendly.com/webhook_subscriptions?organization=https://api.calendly.com/organizations/YOUR_ORG_ID' \
  --header 'Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN'
```

You should see your webhook with `"state": "active"`.

---

## **Step 6: Test the Webhook**

### **6.1 Book a Test Appointment**

1. **Get your Calendly booking link:**
   - Go to: https://calendly.com/YOUR_USERNAME
   - Or find it in Settings → Sharing

2. **Book an appointment:**
   - Fill in test details
   - Select a time slot
   - Confirm booking

3. **Check Firebase immediately:**

   **Option A: Check Firestore in Web Console**
   - Go to: https://console.firebase.google.com/project/cemar-counseling-e8ea3/firestore/data
   - Click **appointments** collection
   - You should see the new appointment

   **Option B: Check Firebase Logs**
   ```bash
   firebase functions:log
   ```
   - Look for: `Added appointment: [ID]`

4. **Check Your Profile Dashboard**
   - Go to: http://localhost:3000/profile
   - Login
   - Look for appointment under **"Upcoming Appointments"**

---

## **Step 7: Test Cancellation**

1. **Cancel the test appointment** in your Calendly calendar
2. **Check Firestore** - status should change to `"cancelled"`
3. **Check profile** - should disappear from Upcoming list

---

## **Calendly API Resources**

| Item | Link |
|------|------|
| API Documentation | https://developer.calendly.com/ |
| Webhook Subscriptions Guide | https://developer.calendly.com/receive-data-from-scheduled-events-in-real-time-with-webhook-subscriptions |
| Webhook Events | https://developer.calendly.com/trigger-automations-with-other-apps-when-invitees-schedule-or-cancel-events |
| Find User/Org URI | https://developer.calendly.com/how-to-find-the-organization-or-user-uri |

---

## **What Happens When Someone Books**

```
Client Books on Calendly
    ↓
Calendly sends "invitee.created" event to Firebase
    ↓
Firebase Cloud Function receives webhook
    ↓
Function extracts: name, email, time, timezone
    ↓
Function saves to Firestore
    ↓
Your Profile listens and updates in real-time
    ↓
🎉 Appointment appears instantly!
```

---

## **Webhook Payload Example**

When someone books, Calendly sends:
```json
{
  "event": "invitee.created",
  "payload": {
    "event": {
      "uri": "https://api.calendly.com/scheduled_events/ABC123",
      "name": "Consultation",
      "start_time": "2026-01-20T14:00:00Z",
      "end_time": "2026-01-20T15:00:00Z"
    },
    "invitee": {
      "uri": "https://api.calendly.com/scheduled_events/ABC123/invitees/XYZ789",
      "name": "John Doe",
      "email": "john@example.com",
      "timezone": "America/New_York"
    }
  }
}
```

---

## **Manual Method (Web UI) - Alternative**

If you prefer the web interface:

1. Go to: https://calendly.com/app/integrations
2. Look for **"Webhooks"** section
3. Click **"New Webhook"** or **"Add Webhook"**
4. Fill in endpoint URL and select events
5. Save

⚠️ **Note:** This URL might change - API method is more reliable.

---

## **Common Issues**

| Issue | Solution |
|-------|----------|
| Webhook not receiving events | Check Firebase function logs |
| 401 Unauthorized error | Token is wrong or expired |
| Appointment not in Firestore | Check Cloud Function logs for errors |
| Appointment not in profile | Click Refresh button or wait 5 seconds |
| "Cannot read property of undefined" | Calendly response format may have changed |

---

## **Quick Reference**

```bash
# List your webhooks
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.calendly.com/webhook_subscriptions?organization=YOUR_ORG_URI"

# Delete a webhook (if needed)
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.calendly.com/webhook_subscriptions/WEBHOOK_ID"

# View Cloud Function logs
firebase functions:log

# Redeploy function
firebase deploy --only functions:calendlyWebhook
```

---

## **Next Steps**

✅ Generate Personal Access Token
✅ Get Organization URI  
✅ Create webhook subscription via API
✅ Test with appointment booking
✅ Verify it appears in your profile
✅ Share your Calendly link with clients!



