# Therapist Dashboard Testing Guide

## Pre-Testing Checklist

Before testing the therapist dashboard, ensure the following are in place:

### 1. Firebase Configuration ✅
- [ ] Firestore Blaze plan enabled (allows Cloud Functions)
- [ ] Cloud Functions deployed and active (`firebase deploy --only functions`)
- [ ] Firebase Secret Manager has `CALENDLY_API_TOKEN` set
- [ ] Firestore rules deployed (check console for latest deployment)

### 2. Calendly Setup ✅
- [ ] Calendly account created and configured
- [ ] At least one booking event type created
- [ ] API token generated from Calendly account settings
- [ ] Token stored in Firebase Secret Manager

### 3. Code Deployment ✅
- [ ] Latest code pushed to GitHub (`git push origin main`)
- [ ] No TypeScript or build errors

## Testing Scenarios

### Scenario 1: New Therapist Signup Flow

**Objective**: Verify that a new therapist can sign up and complete setup

**Steps**:
1. Navigate to `/login?tab=signup`
2. Fill in: Name, Email, Password
3. Click "Sign Up"
4. You should be redirected to home page `/`
5. Manually navigate to `/therapist/dashboard`
6. You should be redirected to `/therapist/setup` (therapist profile doesn't exist yet)
7. Complete the setup form:
   - Full Name: (auto-filled from signup)
   - Phone: (optional)
   - Specialization: (optional)
   - Bio: (optional)
8. Click "Complete Setup"
9. You should see a success screen with "Setup Complete!"
10. After 2 seconds, automatically redirected to `/therapist/dashboard`

**Expected Results**:
- ✅ User document created in Firestore with `role: "therapist"`
- ✅ Therapist profile document created in `therapists/{uid}`
- ✅ Dashboard loads with Stats Bar showing 0 appointments
- ✅ No errors in browser console

**Firestore Verification**:
```
users/{uid} should have:
- uid: (user ID)
- email: (signup email)
- role: "therapist"
- name: (from setup form)

therapists/{uid} should have:
- uid: (user ID)
- email: (from setup)
- name: (from setup form)
- phone: (if provided)
- specialization: (if provided)
- bio: (if provided)
- active: true
- createdAt: (timestamp)
```

---

### Scenario 2: Cloud Function Sync Verification

**Objective**: Verify that the Cloud Function correctly syncs Calendly events

**Prerequisites**:
- [ ] Therapist account created (from Scenario 1)
- [ ] Calendly account linked (same email as therapist signup)
- [ ] At least one appointment booked in Calendly for that day

**Steps**:
1. Log in as the therapist user
2. Navigate to `/therapist/dashboard`
3. Wait up to 10 minutes for the Cloud Function to run (or check Cloud Functions logs)
4. Refresh the page (Ctrl+R or Cmd+R)
5. Check if appointment appears in:
   - Stats Bar (under "Today's Sessions" or "Upcoming")
   - Today's Schedule section (if scheduled for today)
   - Upcoming Appointments section

**Expected Results**:
- ✅ Appointment appears in dashboard within 10 minutes of booking
- ✅ Client name and time display correctly
- ✅ Status shows "scheduled"
- ✅ Real-time listener updates the UI when new appointments sync

**Troubleshooting - No Appointments Appearing**:

**Problem**: Appointments not showing after 15+ minutes
- [ ] Check Cloud Functions logs in Firebase Console:
  ```
  Go to: Firebase Console > Functions > syncCalendlyEvents
  Look for any errors in the logs
  ```
- [ ] Verify Calendly API token is valid:
  ```
  Check: Firebase Console > Secret Manager > CALENDLY_API_TOKEN
  Token should be recent (not expired)
  ```
- [ ] Check therapist email matches Calendly account:
  ```
  Signup email should match Calendly account email
  If different, the Cloud Function can't find the therapist
  ```
- [ ] Check Firestore rules allow appointment writes:
  ```
  Firebase Console > Firestore > Rules
  Should allow service account to write appointments
  ```

**Firestore Verification**:
```
appointments/{eventId} should have:
- eventId: (Calendly event ID)
- therapistId: (therapist user UID)
- therapistEmail: (therapist email)
- clientId: (invitee email from Calendly)
- clientEmail: (invitee email)
- startTime: (Timestamp)
- endTime: (Timestamp)
- status: "scheduled"
- source: "calendly_poll"
- createdAt: (timestamp)
```

---

### Scenario 3: Cancel Appointment

**Objective**: Verify that therapist can cancel appointments

**Prerequisites**:
- [ ] Therapist dashboard has at least one appointment (from Scenario 2)

**Steps**:
1. Log in as therapist
2. Go to `/therapist/dashboard`
3. Find an appointment in "Today's Schedule" or "Upcoming Appointments"
4. Click the "Cancel" button (trash icon)
5. Confirm cancellation in the dialog
6. Observe that appointment status changes to "cancelled"
7. The appointment should move out of "upcoming" counts

**Expected Results**:
- ✅ Cancel button opens a confirmation dialog
- ✅ Confirmation accepted, Firestore document updated with `status: "cancelled"`
- ✅ UI immediately reflects the change (real-time listener)
- ✅ Cancelled appointments appear in red/muted style
- ✅ Stats update (upcoming count decreases, cancelled count increases)

**Firestore Verification**:
```
appointment/{eventId} should have:
- status: "cancelled" (was "scheduled")
- updatedAt: (new timestamp)
```

---

### Scenario 4: View Client Profile

**Objective**: Verify that therapist can view individual client profiles

**Prerequisites**:
- [ ] Therapist has at least one appointment with a client (from Scenario 2)

**Steps**:
1. Log in as therapist
2. Go to `/therapist/dashboard`
3. Find a client in the "Clients" sidebar on the right
4. Click on the client name
5. You should be redirected to `/therapist/clients/{clientId}` (where clientId is invitee email)
6. Page should display:
   - Client name and email
   - Total sessions count
   - Last session date (if any)
   - Next session date (if any)
   - Full appointment history

**Expected Results**:
- ✅ Client profile page loads without errors
- ✅ Displays all appointments for that client filtered by therapistId
- ✅ Appointment history shows in descending order (newest first)
- ✅ Status badges show correctly (green for scheduled, etc.)
- ✅ Can navigate back to dashboard

---

### Scenario 5: Real-Time Updates

**Objective**: Verify that dashboard updates in real-time when changes occur

**Prerequisites**:
- [ ] Therapist dashboard is open in browser
- [ ] Have access to Firestore or another way to test updates

**Steps**:
1. Log in as therapist
2. Open `/therapist/dashboard` in one browser tab
3. Open Firebase Console in another tab (Firestore > appointments collection)
4. Find an appointment for this therapist
5. Edit the appointment document:
   - Change `status` from "scheduled" to "completed"
   - Update `updatedAt` to current time
6. Switch back to the dashboard tab
7. Observe that the appointment updates without requiring a refresh

**Expected Results**:
- ✅ Dashboard updates within 1-2 seconds of Firestore change
- ✅ Stats automatically recalculate
- ✅ Appointment moves to "completed" section if applicable
- ✅ No errors in browser console

---

### Scenario 6: Empty State Handling

**Objective**: Verify dashboard gracefully handles no appointments

**Prerequisites**:
- [ ] Therapist account created but no appointments

**Steps**:
1. Log in as therapist with no appointments
2. Go to `/therapist/dashboard`
3. Observe all sections:
   - Stats bar shows 0 for all counts
   - "Today's Schedule" section shows empty state
   - "Upcoming Appointments" section shows empty state
   - "Clients" list shows empty state

**Expected Results**:
- ✅ Dashboard loads without errors
- ✅ All sections gracefully display empty states
- ✅ No broken UI or console errors

---

### Scenario 7: Role-Based Access Control

**Objective**: Verify that non-therapists cannot access therapist routes

**Prerequisites**:
- [ ] Create two accounts: one therapist, one regular user

**Steps**:
1. Create/sign in as a regular client user (don't complete therapist setup)
2. Try to navigate to `/therapist/dashboard`
3. You should either:
   - Be redirected to `/therapist/setup` (if you don't have therapist role)
   - Or see an access denied message

**Expected Results**:
- ✅ Client users cannot access therapist dashboard
- ✅ Proper authorization checks are in place
- ✅ Helpful error message or redirect to appropriate page

---

## Performance Testing

### Cloud Function Execution Time
- Check Firebase Console > Functions > syncCalendlyEvents
- Execution time should be < 60 seconds
- Memory usage should be < 256MB

### Real-Time Listener Performance
- Open browser DevTools > Performance tab
- Navigate through dashboard
- Real-time listener updates should take < 500ms
- No memory leaks after extended use

## Common Issues and Solutions

### Issue 1: "Therapist not found" in Cloud Function logs

**Symptoms**:
- Cloud Function logs show: "No therapist found for email: [email]"
- Appointments not syncing

**Solution**:
1. Verify therapist signup email matches Calendly email
2. Check that therapist document was created: `therapists/{uid}` in Firestore
3. Ensure therapist setup was completed successfully

### Issue 2: Appointments don't appear immediately

**Symptoms**:
- Appointment booked in Calendly but not showing in dashboard

**Solution**:
- Cloud Function runs every 10 minutes
- Wait up to 10 minutes, then refresh page
- Check Cloud Function logs for errors
- Verify Calendly API token is valid (not expired)

### Issue 3: "Missing or insufficient permissions"

**Symptoms**:
- Firestore errors when loading dashboard

**Solution**:
1. Go to Firebase Console > Firestore > Rules
2. Verify rules allow authenticated users to read appointments
3. Redeploy rules: `firebase deploy --only firestore:rules`

### Issue 4: AlertDialog not showing/styling issues

**Symptoms**:
- Cancel confirmation dialog doesn't appear or looks broken

**Solution**:
1. Check browser console for errors
2. Verify alertdialog.tsx exists in `/components/ui/`
3. Import should be: `import { AlertDialog, ... } from '../../ui/alert-dialog'`
4. Check Tailwind CSS is properly configured

### Issue 5: Real-time listener not updating

**Symptoms**:
- Dashboard doesn't update when Firestore data changes
- Have to refresh to see updates

**Solution**:
1. Check browser console for listener errors
2. Verify Firestore rules allow read access
3. Check network tab - listener should maintain WebSocket connection
4. Try clearing browser cache and reloading

## Regression Testing Checklist

After any code changes, verify:

- [ ] Therapist signup flow still works
- [ ] Cloud Function still syncs appointments
- [ ] Dashboard loads without errors
- [ ] Real-time listeners update correctly
- [ ] Cancel appointments still works
- [ ] Client profile page loads
- [ ] Empty states display correctly
- [ ] Role-based access control still works
- [ ] No TypeScript/build errors
- [ ] No console errors on any page

## Load Testing (Optional)

For production readiness:

1. Create 10+ test therapist accounts
2. Create 100+ test appointments across accounts
3. Monitor:
   - Cloud Function execution time
   - Firestore read/write operations
   - Real-time listener performance
   - Dashboard load time

## Next Steps After Passing All Tests

1. ✅ Deploy to production
2. ✅ Monitor Cloud Function logs for errors
3. ✅ Gather feedback from beta testers
4. ✅ Iterate on UI/UX based on feedback
5. ✅ Consider implementing:
   - [ ] Appointment notes per session
   - [ ] Client outcome tracking
   - [ ] Email notifications for new bookings
   - [ ] Therapist availability management
   - [ ] Reporting and analytics
