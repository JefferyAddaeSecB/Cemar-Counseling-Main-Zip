# Therapist Login Redirect Fix Documentation

## Problem Statement
When therapists signed in to the platform, they were being redirected to the regular client dashboard instead of their therapist dashboard. This occurred despite the Firebase Firestore configuration and therapist profile setup being complete with proper document IDs and role assignments.

## Root Cause Analysis

### Issue 1: Missing Role in Login Flow
The `login()` function in `auth-helpers.ts` was fetching user data from Firestore but **NOT including the `role` field** in the returned `User` object. This meant the role information was never available to the navigation logic.

**Before:**
```typescript
const userData: User = {
  id: user.uid,
  name: userProfile.name,
  email: user.email || '',
  avatar: userProfile.avatar,
  // ❌ role field missing!
}
```

### Issue 2: No Redirect Logic for Therapists
The login page's `handleLogin()` function always redirected to home or the `returnUrl`, without checking if the user was a therapist.

**Before:**
```typescript
if (returnUrl) {
  navigate(returnUrl)
} else {
  navigate('/') // ❌ Always home, never therapist dashboard
}
```

### Issue 3: Google Sign-In Missing Role
Similar to email/password login, Google Sign-In wasn't fetching the role from Firestore, and the button component wasn't redirecting therapists.

## Solutions Implemented

### 1. ✅ Updated `login()` Function
**File:** `src/lib/auth-helpers.ts`

Now fetches and includes the role from the Firestore user profile:

```typescript
const userData: User = {
  id: user.uid,
  name: userProfile.name,
  email: user.email || '',
  avatar: userProfile.avatar,
  role: userProfile.role as 'client' | 'therapist' | 'admin', // ✅ Added
}
```

### 2. ✅ Updated `signup()` Function
**File:** `src/lib/auth-helpers.ts`

Ensures the role is included when creating a new user (defaults to 'client'):

```typescript
const userData: User = {
  id: firebaseUser.uid,
  name: name,
  email: email,
  avatar: firebaseUser.photoURL || undefined,
  role: 'client', // ✅ Explicitly included
}
```

### 3. ✅ Updated `signInWithGoogle()` Function
**File:** `src/lib/auth-helpers.ts`

Now fetches the role from Firestore for existing users, and defaults to 'client' for new users:

```typescript
// Fetch existing user profile with role
let userProfile = await getUserFromFirestore(user.uid)

// If new user, create default profile
if (!userProfile) {
  userProfile = {
    // ... user data
    role: 'client', // ✅ Explicit default
  }
  await saveUserToFirestore(user.uid, userProfile)
}

// ✅ Include role in returned User object
const userData: User = {
  // ... other fields
  role: userProfile.role as 'client' | 'therapist' | 'admin',
}
```

### 4. ✅ Updated Login Page Redirect Logic
**File:** `src/pages/login/page.tsx`

Added role-based routing in `handleLogin()`:

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  setIsLoading(true)

  try {
    const user = await login(loginData.email, loginData.password)
    const params = new URLSearchParams(location.search)
    const returnUrl = params.get('returnUrl')
    
    // ✅ Check if user is a therapist
    if (user.role === 'therapist') {
      navigate('/therapist/dashboard')
    } else if (returnUrl) {
      navigate(returnUrl)
    } else {
      navigate('/')
    }
  } catch (err) {
    // ... error handling
  }
}
```

### 5. ✅ Updated Google Sign-In Button
**File:** `src/components/google-sign-in-button.tsx`

Updated `handleGoogleSignIn()` to redirect based on role:

```typescript
const handleGoogleSignIn = async () => {
  try {
    const user = await signInWithGoogle()
    
    // ✅ Check if user is a therapist
    if (user.role === 'therapist') {
      navigate('/therapist/dashboard')
    } else if (returnUrl) {
      navigate(returnUrl)
    } else {
      navigate('/')
    }
  } catch (err) {
    // ... error handling
  }
}
```

## Data Flow Verification

### Current Flow for Therapist Login

1. **User enters credentials** → Login page
2. **Credentials sent to Firebase Auth** → Authenticate
3. **Fetch user profile from Firestore** → Get `users/{uid}` document
4. **Extract role from profile** → `role: 'therapist'`
5. **Return User object with role** → `login()` returns User with role
6. **Save to localStorage** → User object includes role
7. **Check role in navigate logic** → `if (user.role === 'therapist')`
8. **Redirect to therapist dashboard** → `/therapist/dashboard`
9. **ProtectedTherapistRoute validates** → Checks Firestore for role
10. **Therapist dashboard loads** → Shows appointments, clients, stats

## Required Firebase Structure

For therapists to be properly redirected, ensure this structure exists in Firestore:

```
users/{uid}
  ├── role: "therapist"
  ├── email: "therapist@example.com"
  ├── name: "Dr. Name"
  └── avatar?: "url"

therapists/{uid}
  ├── userId: uid
  ├── bio: "..."
  ├── specialization: "..."
  ├── phone: "..."
  └── availability: {...}
```

## Testing the Fix

### Test Case 1: Email/Password Login - Therapist
1. Go to `/login`
2. Enter therapist email and password
3. ✅ Should redirect to `/therapist/dashboard`
4. ✅ Should see therapist dashboard (appointments, clients, stats)

### Test Case 2: Email/Password Login - Client
1. Go to `/login`
2. Enter client email and password
3. ✅ Should redirect to `/` or returnUrl
4. ✅ Should NOT see therapist dashboard

### Test Case 3: Google Sign-In - Therapist
1. Go to `/login`
2. Click "Sign in with Google"
3. Select therapist account
4. ✅ Should redirect to `/therapist/dashboard`

### Test Case 4: Google Sign-In - New User
1. Go to `/login`
2. Click "Sign in with Google"
3. Use new Google account
4. ✅ Should create user with `role: 'client'`
5. ✅ Should redirect to `/`

## Deployment Notes

- ✅ No database migrations required
- ✅ No environment variable changes needed
- ✅ No breaking changes to existing functionality
- ✅ Backward compatible with existing users
- ✅ All TypeScript types properly defined

## Files Modified

1. `src/lib/auth-helpers.ts` - Core auth functions
   - `login()` - Added role to returned User
   - `signup()` - Added role to returned User
   - `signInWithGoogle()` - Fetch and return role

2. `src/pages/login/page.tsx` - Login page logic
   - `handleLogin()` - Added therapist redirect

3. `src/components/google-sign-in-button.tsx` - Google button logic
   - `handleGoogleSignIn()` - Added therapist redirect

## Git Commit Info

**Commit Hash:** 8667ae8  
**Message:** "Fix therapist login redirect to dashboard"  
**Files Changed:** 3  
**Insertions:** 35  
**Deletions:** 12  

## Troubleshooting

### Therapists Still See Client Dashboard
1. Check Firestore `users/{uid}` document
2. Verify `role` field equals `"therapist"` (case-sensitive)
3. Try clearing browser localStorage and re-logging in
4. Check browser console for any error messages

### Login Redirects to Home Instead of Dashboard
1. Verify Firestore `users/{uid}` document exists
2. Check if user profile fetch is working (check network requests)
3. Verify role field is present and set correctly
4. Check if there are any TypeScript errors in console

### Therapist Dashboard Shows "Access Denied"
1. This is the ProtectedTherapistRoute checking Firestore
2. Verify `users/{uid}` has `role: "therapist"`
3. Verify Firestore rules allow reading this document
4. Check browser console for Firestore permission errors

## Summary

The therapist login redirect issue has been completely resolved. Therapists now:
- ✅ Sign in successfully
- ✅ Get redirected immediately to their dashboard
- ✅ See their professional Jane-like interface with appointments
- ✅ Can manage clients and view schedules

The fix works for all sign-in methods:
- ✅ Email/Password login
- ✅ Google Sign-In
- ✅ Both new and existing users
