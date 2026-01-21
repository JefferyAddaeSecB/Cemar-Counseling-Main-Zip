# Therapist Login Debug & Fix Guide

## 🔍 Step 1: Check Your Firestore Data

### What You Need to Verify

For each therapist, there must be TWO documents:

**Document 1:** `users/{uid}`
```
users/0Jr9rTujBiNqQ1r6p2ptN9ZseyF2
├── role: "therapist"        ← CRITICAL: Must be exactly this
├── email: "info@cemarcounseling.com"
├── name: "Richard Titus-Glover"
└── avatar?: "url"
```

**Document 2:** `therapists/{uid}`
```
therapists/0Jr9rTujBiNqQ1r6p2ptN9ZseyF2
├── uid: "0Jr9rTujBiNqQ1r6p2ptN9ZseyF2"
├── email: "info@cemarcounseling.com"
├── name: "Richard Titus-Glover"
├── phone: "..."
├── specialization: "..."
└── bio: "..."
```

### How to Check in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your CEMAR project
3. Go to **Firestore Database**
4. Click on **users** collection
5. Find the therapist's UID document
6. **Check the `role` field:**
   - ✅ If `role: "therapist"` exists → Good!
   - ❌ If `role: "client"` → Need to fix
   - ❌ If no `role` field → Need to add it

## 🔧 Step 2: Method A - Manual Fix in Firebase Console

### To Fix a Single Therapist:

1. Firebase Console → Firestore Database
2. Open **users** collection
3. Click the therapist's UID document
4. **Edit or add the `role` field:**
   - Field name: `role`
   - Type: `string`
   - Value: `therapist` (exactly this)
5. Save
6. **Clear browser cache:**
   - F12 → Application → Storage → Clear site data
7. Log in again - should now redirect to dashboard ✅

## ⚙️ Step 3: Method B - Automatic Fix via Cloud Function

### If You Have Multiple Therapists to Fix:

The `fixTherapistRoles` Cloud Function will automatically fix all therapists at once.

#### Prerequisites:
- You must be logged in as ANY user
- Cloud Functions must be deployed

#### How to Run:

1. **Deploy the function:**
   ```bash
   cd functions
   npm install
   firebase deploy --only functions
   ```

2. **Call it from your browser console:**
   ```javascript
   // First, ensure you're logged in to the app
   // Then open browser console and run:
   
   const { getFunctions, httpsCallable } = firebase.functions;
   const functions = getFunctions();
   const fixRoles = httpsCallable(functions, 'fixTherapistRoles');
   
   fixRoles().then(result => {
     console.log('Migration result:', result.data);
   }).catch(error => {
     console.error('Migration failed:', error);
   });
   ```

3. **Check the output:**
   - You should see logs like:
   ```
   🔧 Starting therapist role migration...
   Found 2 therapists
   ✅ Therapist 0Jr9rT... already has role: "therapist"
   🔄 Fixing role for therapist abc123... (current: client)
   ✅ Fixed therapist abc123
   Migration complete: { fixed: 1, alreadyCorrect: 1, errors: 0 }
   ```

## 🧪 Step 4: Test After Fix

1. **Clear browser data:**
   - Open DevTools (F12)
   - Application tab → Storage → Clear all site data

2. **Log in as therapist**
   - Go to `/login`
   - Enter therapist email and password

3. **Check browser console** (F12 → Console tab):
   - Should see: `"🔐 Login successful: { id: '...', email: '...', role: 'therapist' }"`
   - Should see: `"✅ User is therapist, redirecting to /therapist/dashboard"`

4. **Verify redirect:**
   - Should be redirected to `/therapist/dashboard`
   - Should see therapist dashboard (appointments, clients, stats)

## 🐛 Common Issues & Solutions

### Issue 1: "User profile not found"
**Cause:** users/{uid} document doesn't exist
**Solution:**
- Manually create it in Firebase Console
- Or run the therapist setup page to create it

### Issue 2: "User is client, redirecting to home"
**Cause:** users/{uid}.role is not "therapist"
**Solution:**
- Check Firebase Console users collection
- Edit the role field to "therapist"
- Clear browser cache and re-login

### Issue 3: "Cannot read property 'role' of undefined"
**Cause:** Firestore fetch failed or security rules blocked it
**Solution:**
- Check Firestore Rules in Firebase Console
- Verify users/{uid} document readable by the user
- Check browser console for Firestore errors

### Issue 4: Still redirects to home after fix
**Cause:** Browser cache still has old data
**Solution:**
```javascript
// In browser console:
localStorage.removeItem('userData');
localStorage.removeItem('authToken');
location.reload();
```
Then log in again.

## 📋 Checklist

- [ ] Verified Firestore users/{uid} document exists
- [ ] Verified role field = "therapist" (case-sensitive)
- [ ] Applied fix (manual or automatic)
- [ ] Cleared browser localStorage/cache
- [ ] Logged in again
- [ ] Check browser console for "✅ User is therapist" message
- [ ] Verified redirected to /therapist/dashboard
- [ ] Therapist dashboard loads correctly

## 🚀 Deployment

After fixing:

1. Commit your changes:
   ```bash
   git add -A
   git commit -m "Add therapist role migration function"
   git push origin main
   ```

2. Deploy functions (if modified):
   ```bash
   firebase deploy --only functions
   ```

## 📞 Still Not Working?

Check these in order:

1. **Browser Console (F12):**
   - What messages do you see during login?
   - Any red error messages?

2. **Firebase Console:**
   - Does users/{uid} document exist?
   - Does it have role: "therapist"?

3. **Network Tab (F12):**
   - Did Firestore request succeed?
   - Check response for the role field

4. **localStorage (F12 → Application):**
   - Does userData have role: "therapist"?
   - Or is it missing/empty?

If still stuck, provide:
- The therapist UID
- Screenshot of Firestore users/{uid} document
- Browser console logs during login attempt

## 📚 Related Documentation

- Full fix details: `THERAPIST_LOGIN_REDIRECT_FIX.md`
- Quick reference: `THERAPIST_LOGIN_QUICK_FIX.md`
- Setup guide: `THERAPIST_DASHBOARD_GUIDE.md`
