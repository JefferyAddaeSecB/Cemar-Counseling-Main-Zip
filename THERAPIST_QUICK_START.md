# Quick Start: Testing the Therapist Dashboard

## 5-Minute Setup

### Prerequisites
- ✅ Therapist dashboard code deployed to GitHub
- ✅ Cloud Functions deployed to Firebase  
- ✅ Firestore rules updated
- ✅ Calendly API token in Firebase Secret Manager

### Step 1: Create a Test Therapist Account (1 min)
```
1. Go to http://localhost:5173/login (or your production URL)
2. Click "Sign Up"
3. Enter:
   - Name: "Test Therapist"
   - Email: "therapist@example.com" (use your Calendly email!)
   - Password: "SecurePassword123"
4. Click "Sign Up"
5. You'll be redirected to home page
```

### Step 2: Complete Therapist Setup (1 min)
```
1. Navigate to http://localhost:5173/therapist/dashboard
2. You'll be redirected to /therapist/setup
3. Form fields are pre-filled with your signup name
4. Fill in (optional):
   - Phone: "+1 (555) 123-4567"
   - Specialization: "Cognitive Behavioral Therapy"
   - Bio: "I specialize in anxiety and depression"
5. Click "Complete Setup"
6. You'll see a success screen
7. After 2 seconds, auto-redirected to dashboard
```

### Step 3: Test Appointment Sync (5-10 min)
```
1. Log in to your Calendly account with SAME email
2. Create a new event in Calendly or update existing one:
   - Title: "Test Session"
   - Date/Time: Today or next 7 days
   - Add a fake client email: "client@example.com"
   - Save/book the appointment
3. Back in therapist dashboard, wait up to 10 minutes
4. Refresh the page (Cmd+R or Ctrl+R)
5. You should see:
   - Stats bar updated with new appointment count
   - Appointment appears in "Today's Schedule" or "Upcoming"
   - Client "client@example.com" appears in clients list
```

### Step 4: Test Features (2-3 min)
```
Test Cancel:
- Find an appointment
- Click "Cancel" button (trash icon)
- Confirm in dialog
- Watch it move to "Cancelled" section

Test Client Profile:
- Click on client name in sidebar
- See all their appointments
- Session counts and dates displayed

Test Real-Time:
- In another browser tab, open Firebase Console
- Find the appointment document
- Change status from "scheduled" to "completed"
- Dashboard updates without refresh!
```

---

## Troubleshooting Quick Fixes

### 🔴 Setup page not showing?
- Check browser console for errors
- Verify you're logged in: `checkIsLoggedIn()` should be true
- Clear cache: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### 🔴 Appointment not appearing?
- Check therapist email matches Calendly email exactly
- Wait 10 minutes for Cloud Function to run
- Check Firebase Console > Functions logs for errors
- Try creating a new event in Calendly while watching logs

### 🔴 Firestore errors in console?
- Go to Firebase Console > Firestore > Rules
- Verify rules are deployed (should see latest date)
- Check that appointments collection shows created documents

### 🔴 Styling looks broken?
- Make sure Tailwind CSS is working: Check inspector for `class` attributes
- Components use Shadcn/ui: Verify they're styled with Tailwind classes
- Check `/src/styles/globals.css` is imported in App.tsx

---

## Key Routes to Test

| Route | Expected Behavior |
|-------|-------------------|
| `/therapist/setup` | Onboarding form (before profile created) |
| `/therapist/dashboard` | Main dashboard with appointments (after setup) |
| `/therapist/clients/client@example.com` | Client profile with appointment history |

---

## Debug Commands

### Check Firestore Schema
```javascript
// In browser console while logged in:
db.collection('users').doc(auth.currentUser.uid).get().then(d => console.log(d.data()))
db.collection('therapists').doc(auth.currentUser.uid).get().then(d => console.log(d.data()))
db.collection('appointments').get().then(snap => snap.docs.forEach(d => console.log(d.data())))
```

### Check Cloud Function Logs
```
Firebase Console
→ Functions
→ syncCalendlyEvents
→ Logs tab
→ Filter by therapist email
→ Look for "Found therapist UID: xxxxxxxx"
```

### Monitor Real-Time Listener
```javascript
// In browser console:
// Dashboard should log listener updates
// Open DevTools > Network > WebSocket
// Should see active connection to Firestore
```

---

## Success Checklist

After following the quick start, you should have:

- ✅ User document in Firestore with `role: "therapist"`
- ✅ Therapist profile in Firestore `therapists/{uid}`
- ✅ Appointment document synced from Calendly
- ✅ Dashboard displaying with real-time listener active
- ✅ Able to see appointments in multiple sections
- ✅ Able to cancel appointments and see status change
- ✅ Able to click clients and view profiles
- ✅ No errors in browser console

---

## Next: Run Full Testing

Once quick start works, run the comprehensive testing guide:
→ **See THERAPIST_TESTING_GUIDE.md for detailed test scenarios**

---

## Common Questions

**Q: Why is my email showing as the client ID?**
A: The Cloud Function stores the Calendly invitee email as `clientId`. This is by design - it allows the invite email to see their own appointments. Real client UIDs can be added later if needed.

**Q: Can I test without a real Calendly account?**
A: Yes! Manually add appointments to Firestore:
```javascript
db.collection('appointments').doc('test-event-1').set({
  eventId: 'test-event-1',
  therapistId: auth.currentUser.uid,
  therapistEmail: auth.currentUser.email,
  clientId: 'test@example.com',
  clientEmail: 'test@example.com',
  clientName: 'Test Client',
  startTime: new Date(),
  endTime: new Date(Date.now() + 3600000),
  status: 'scheduled',
  source: 'manual_test',
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Q: How often does the Cloud Function run?**
A: Every 10 minutes. You can see the last run time in Firebase Console > Functions.

**Q: Does it auto-sync when I create new appointments?**
A: No, it syncs every 10 minutes via Cloud Scheduler. For immediate testing, manually add to Firestore (see above).

**Q: Can multiple therapists see the same dashboard?**
A: No, each therapist only sees their own appointments (filtered by `therapistId`). This is enforced by Firestore rules and the query in the dashboard.

---

## Production Deployment

Once testing is complete:

1. **Verify Cloud Function Logs**
   - No errors for 24+ hours
   - Consistent sync every 10 minutes

2. **Load Test**
   - Create 10+ therapist accounts
   - Create 100+ appointments
   - Monitor performance

3. **User Testing**
   - Give beta therapists access
   - Gather feedback on UI/UX
   - Fix any issues

4. **Go Live**
   - Deploy to production
   - Monitor error rates
   - Support early users

---

**Ready to test?** Start with Step 1 above! 🚀
