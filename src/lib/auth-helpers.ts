import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential
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
    await setDoc(userRef, {
      ...userData,
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
    throw error
  }
}

// Email/Password Sign-Up
export async function signup(name: string, email: string, password: string): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const user = result.user

    // Create user object
    const userData: User = {
      id: user.uid,
      name: name,
      email: email,
      avatar: undefined,
    }

    // Save to Firestore
    await saveUserToFirestore(user.uid, {
      ...userData,
      role: 'client',
    })

    // Save to localStorage
    saveUserToLocalStorage(userData)
    setLoggedIn(true, user.uid)

    return userData
  } catch (error) {
    console.error("Error signing up:", error)
    throw error
  }
}

// Email/Password Sign-In
export async function login(email: string, password: string): Promise<User> {
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
    throw error
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

