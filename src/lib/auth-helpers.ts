import {
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, firestore } from './firebase'

// This is an auth helper for Firebase Authentication with Google Sign-In
// Integrates with Firestore for user data storage

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: 'client' | 'therapist' | 'admin'
  createdAt?: Date
}

export interface UserProfile extends User {
  phone?: string
  dateOfBirth?: string
  address?: string
  role: 'client' | 'therapist' | 'admin'
}

// Check if user is logged in
export function checkIsLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("authToken") !== null
}

// Set login state
export function setLoggedIn(value: boolean, token?: string): void {
  if (typeof window === "undefined") return
  if (value && token) {
    localStorage.setItem("authToken", token)
  } else {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
  }
  window.dispatchEvent(new Event("storage"))
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (!checkIsLoggedIn()) return null

  const userData = localStorage.getItem("userData")
  if (!userData) return null

  try {
    return JSON.parse(userData) as User
  } catch (e) {
    return null
  }
}

// Store user in localStorage
function saveUserToLocalStorage(user: User): void {
  localStorage.setItem("userData", JSON.stringify(user))
}

// Create or update user in Firestore
async function saveUserToFirestore(uid: string, userData: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(firestore, 'users', uid)
    // Remove undefined fields (especially avatar)
    const filteredUserData = Object.fromEntries(
      Object.entries(userData).filter(([_, v]) => v !== undefined)
    )
    await setDoc(userRef, {
      ...filteredUserData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true })
  } catch (error) {
    console.error("Error saving user to Firestore:", error)
    throw error
  }
}

// Get user from Firestore
async function getUserFromFirestore(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(firestore, 'users', uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error("Error fetching user from Firestore:", error)
    return null
  }
}

// Google Sign-In
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Create user object
    const userData: User = {
      id: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      avatar: user.photoURL || undefined,
    }

    // Save to Firestore
    await saveUserToFirestore(user.uid, {
      ...userData,
      role: 'client', // Default role, can be changed later
    })

    // Save to localStorage
    saveUserToLocalStorage(userData)
    setLoggedIn(true, user.uid)

    return userData
  } catch (error) {
    console.error("Error signing in with Google:", error)
    const msg = mapFirebaseAuthError(error)
    throw new Error(msg)
  }
}

// Email/Password Sign-Up
export async function signup(name: string, email: string, password: string): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser: FirebaseUser = result.user

    // Attempt to set the displayName on the Firebase Auth user
    try {
      await updateProfile(firebaseUser, { displayName: name })
    } catch (updErr) {
      console.warn('Warning: could not update profile displayName', updErr)
    }

    // Create user object for app
    const userData: User = {
      id: firebaseUser.uid,
      name: name,
      email: email,
      avatar: firebaseUser.photoURL || undefined,
    }

    // Save to Firestore
    await saveUserToFirestore(firebaseUser.uid, {
      ...userData,
      role: 'client',
    })

    // Save to localStorage
    saveUserToLocalStorage(userData)
    setLoggedIn(true, firebaseUser.uid)

    return userData
  } catch (error: any) {
    console.error('Error signing up:', error)
    const message = mapFirebaseAuthError(error)
    throw new Error(message)
  }
}

// Email/Password Sign-In
export async function login(email: string, password: string): Promise<User> {
  if (!email || !password) {
    throw new Error('Email and password are required.')
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const user = result.user

    // Fetch user profile from Firestore
    const userProfile = await getUserFromFirestore(user.uid)

    if (!userProfile) {
      throw new Error("User profile not found")
    }

    const userData: User = {
      id: user.uid,
      name: userProfile.name,
      email: user.email || '',
      avatar: userProfile.avatar,
    }

    // Save to localStorage
    saveUserToLocalStorage(userData)
    setLoggedIn(true, user.uid)

    return userData
  } catch (error) {
    console.error("Error logging in:", error)
    const msg = mapFirebaseAuthError(error)
    throw new Error(msg)
  }
}

// Map Firebase auth error codes to friendly messages
function mapFirebaseAuthError(err: any): string {
  if (!err) return 'Authentication error'
  const code: string = err.code || ''

  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already in use. Try logging in or use a different email.'
    case 'auth/invalid-email':
      return 'The email address is invalid.'
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.'
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/user-not-found':
      return 'No user found with this email. Please sign up first.'
    case 'auth/user-disabled':
      return 'This user account has been disabled.'
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup closed before completing sign-in.'
    default:
      return err.message || 'Authentication error'
  }
}

// Logout
export async function logout(): Promise<boolean> {
  try {
    await firebaseSignOut(auth)
    localStorage.removeItem("userData")
    localStorage.removeItem("authToken")
    setLoggedIn(false)
    return true
  } catch (error) {
    console.error("Error logging out:", error)
    throw error
  }
}

