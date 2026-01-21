#!/bin/bash

# This script helps diagnose the therapist login redirect issue
# It provides step-by-step debugging instructions

cat << 'EOF'
╔════════════════════════════════════════════════════════════════════╗
║     THERAPIST LOGIN REDIRECT - DEBUGGING CHECKLIST                ║
╚════════════════════════════════════════════════════════════════════╝

If therapists are not being redirected to the dashboard, follow these steps:

STEP 1: Check Browser Console
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open your browser's Developer Tools (F12 or Cmd+Option+I)
2. Go to the "Console" tab
3. Try logging in as a therapist
4. Look for these log messages:
   
   ✅ Expected logs if working:
   - "🔐 Login successful: { id: '...', email: '...', role: 'therapist' }"
   - "✅ User is therapist, redirecting to /therapist/dashboard"
   
   ❌ If you see instead:
   - "👥 User is client, redirecting to home or returnUrl"
   → The role field is NOT set to 'therapist' in Firestore

STEP 2: Verify Firestore Document Structure
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to Firebase Console → Firestore Database
2. Click on "users" collection
3. Find the therapist's UID document
4. Check the fields:
   
   Required fields for therapist:
   ✅ role: "therapist"           ← MUST be exactly this string
   ✅ email: "therapist@..."
   ✅ name: "Dr. Name"
   
   If ANY of these are missing or wrong:
   → You need to manually edit the document in Firebase Console

STEP 3: Fix Missing Role Field
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If the "role" field is missing or set to "client":

1. Firebase Console → Firestore Database
2. Open users collection
3. Click on the therapist's UID document
4. Click "Edit" on the role field (or add new field if missing)
5. Set:
   Field name: role
   Type: string
   Value: therapist
6. Save
7. Clear browser localStorage and log in again

STEP 4: Check Application Logs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When you log in, you should see in browser console:

Step 1 - Login function runs:
   "📋 Firestore profile for user: {uid} {...}"

Step 2 - User data is compiled:
   "✅ User data compiled: { id: '...', role: 'therapist' }"

Step 3 - Login page checks role:
   "🔐 Login successful: { id: '...', role: 'therapist' }"

Step 4 - Redirect decision:
   "✅ User is therapist, redirecting to /therapist/dashboard"

If any step is missing, there's an error. Check previous console lines.

STEP 5: Verify localStorage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After login:

1. Developer Tools → Application tab
2. Find "localStorage"
3. Look for key "userData"
4. Verify it contains: { ..., role: "therapist" }

If role is missing from localStorage:
→ The login function is not saving it correctly
→ Check that Firestore has the role field

QUICK FIX CHECKLIST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ Firestore users/{uid} has role: "therapist"? 
  → If no: Add/fix this field in Firebase Console
  
☐ After fix, clear browser localStorage?
  → Developer Tools → Application → localStorage → Clear all
  
☐ Log in again and check console?
  → Should see "✅ User is therapist" message
  
☐ Redirected to /therapist/dashboard?
  → If yes: Issue is FIXED! ✅
  → If no: Check console for error messages

COMMON ISSUES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue: "User profile not found"
→ Solution: users/{uid} document doesn't exist in Firestore
→ Fix: Create it with role: "therapist"

Issue: "User is client, redirecting to home"
→ Solution: users/{uid}.role is not set to "therapist"
→ Fix: Edit the role field in Firebase Console

Issue: "Cannot read property 'role' of undefined"
→ Solution: Firestore fetch failed
→ Fix: Check Firestore security rules allow reading users/{uid}

Need help? Check these files:
- src/lib/auth-helpers.ts (login function)
- src/pages/login/page.tsx (redirect logic)
- THERAPIST_LOGIN_REDIRECT_FIX.md (full documentation)

EOF
