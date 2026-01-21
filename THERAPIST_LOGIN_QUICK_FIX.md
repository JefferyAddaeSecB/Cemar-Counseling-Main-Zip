# Quick Reference: Therapist Login Fix

## 🚀 What Was Fixed

Therapists now **automatically redirect to `/therapist/dashboard`** when they sign in, instead of seeing the regular client dashboard.

## ✅ How It Works

### Sign-In Flow
```
Therapist logs in
↓
System fetches `role` from Firestore
↓
Role = "therapist" ?
├─ YES → Redirect to /therapist/dashboard ✅
└─ NO → Redirect to home or returnUrl
```

### Required Firestore Structure
```
users/{uid}
├── role: "therapist"  ← This field is CRITICAL
├── email: "..."
├── name: "..."
└── avatar?: "..."
```

## 🔑 Key Changes

| File | Change |
|------|--------|
| `src/lib/auth-helpers.ts` | Added `role` to User object in login(), signup(), signInWithGoogle() |
| `src/pages/login/page.tsx` | Added therapist check: `if (user.role === 'therapist') navigate('/therapist/dashboard')` |
| `src/components/google-sign-in-button.tsx` | Added role-based redirect for Google Sign-In |

## 🧪 How to Test

### Test 1: Therapist Email/Password Login
```
1. Go to /login
2. Enter therapist email & password
3. ✅ Redirected to /therapist/dashboard
4. ✅ See appointments, clients, stats
```

### Test 2: Client Email/Password Login
```
1. Go to /login
2. Enter client email & password
3. ✅ Redirected to / (home page)
4. ✅ NOT directed to therapist dashboard
```

### Test 3: Google Sign-In
```
1. Go to /login
2. Click Google Sign-In
3. For therapist account:
   ✅ Redirected to /therapist/dashboard
4. For client account:
   ✅ Redirected to / (home page)
```

## 🔧 Troubleshooting

### Problem: Still redirects to home
**Solution:** Check Firestore `users/{uid}` document has `role: "therapist"`

### Problem: "Access Denied" on dashboard
**Solution:** The ProtectedTherapistRoute is checking Firestore. Verify:
- `users/{uid}` exists
- `role` field = "therapist" (case-sensitive)
- Firestore rules allow reading this document

### Problem: Login fails
**Solution:** Check browser console for errors. Verify:
- User document exists in Firestore
- Email matches between Auth and Firestore
- No Firestore permission errors

## 📊 Data Saved to localStorage

When therapist logs in, localStorage now includes:
```javascript
{
  "userData": {
    "id": "uid123...",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "role": "therapist"  // ← NEW
  },
  "authToken": "uid123..."
}
```

## 🎯 Navigation Rules (After Fix)

| User Role | Login | Sign Up | Sign In (Google) |
|-----------|-------|---------|-----------------|
| therapist | → Dashboard | → Setup | → Dashboard |
| client | → Home | → Home | → Home |
| (new user) | N/A | → Home | → Home |

## 📌 Important Notes

- ✅ Works for email/password AND Google Sign-In
- ✅ Works for existing and new therapist accounts
- ✅ Backward compatible - doesn't break client logins
- ✅ Role is fetched fresh from Firestore on every login
- ✅ Clients are always created with `role: "client"` by default

## 🔗 Related Files

- Therapist Dashboard: `src/pages/therapist/dashboard/page.tsx`
- Route Protection: `src/components/therapist/protected-route.tsx`
- Full Fix Doc: `THERAPIST_LOGIN_REDIRECT_FIX.md`

## ✨ Git Commits

```
8667ae8 - Fix therapist login redirect to dashboard
d650308 - Add comprehensive therapist login redirect fix documentation
```
