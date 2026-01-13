import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
}

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Firebase configuration is incomplete. Please check your .env.local file.')
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Authentication
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
// Prompt user to select account when signing in
googleProvider.setCustomParameters({ prompt: 'select_account' })

// Initialize Realtime Database (for n8n automation triggers)
export const database = getDatabase(app, firebaseConfig.databaseURL)

// Initialize Firestore (for structured document storage)
export const firestore = getFirestore(app)

export default app
