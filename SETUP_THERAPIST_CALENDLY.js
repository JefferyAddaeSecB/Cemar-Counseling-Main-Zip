// Script to setup Calendly integration in Firebase for a therapist
// This will add Calendly credentials to the therapist's document in Firestore

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

// ============================================
// CONFIGURATION - FILL THESE IN
// ============================================

const THERAPIST_EMAIL = 'jefferyaddae@gmail.com'; // Your therapist email
const CALENDLY_TOKEN = 'YOUR_CALENDLY_TOKEN_HERE'; // From step 1
const CALENDLY_ORGANIZATION_URI = 'YOUR_ORG_URI_HERE'; // From GET_CALENDLY_INFO.js
const CALENDLY_USER_URI = 'YOUR_USER_URI_HERE'; // From GET_CALENDLY_INFO.js

// Firebase configuration (from your .env.local)
const firebaseConfig = {
  apiKey: "AIzaSyCHSKVbMp13wlvHNFOPjVMqe8qKMDG3oRU",
  authDomain: "cemar-dev.firebaseapp.com",
  projectId: "cemar-dev",
  storageBucket: "cemar-dev.firebasestorage.app",
  messagingSenderId: "831652030698",
  appId: "1:831652030698:web:b26cf7e64dc36e1f3866f7",
  databaseURL: "https://cemar-dev-default-rtdb.firebaseio.com"
};

// ============================================

async function setupTherapistCalendly() {
  console.log('🚀 Setting up Calendly integration for therapist...\n');

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  try {
    // Find therapist by email
    console.log(`🔍 Looking for therapist: ${THERAPIST_EMAIL}`);
    
    // First, get all users and find the therapist
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', THERAPIST_EMAIL));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`No user found with email: ${THERAPIST_EMAIL}`);
    }

    const therapistDoc = querySnapshot.docs[0];
    const therapistId = therapistDoc.id;
    const therapistData = therapistDoc.data();

    console.log('✅ Found therapist:');
    console.log('   ID:', therapistId);
    console.log('   Name:', therapistData.name || 'N/A');
    console.log('   Role:', therapistData.role || 'N/A');
    console.log('');

    if (therapistData.role !== 'therapist') {
      console.log('⚠️  Warning: User role is not "therapist", setting it now...');
      await updateDoc(doc(db, 'users', therapistId), { role: 'therapist' });
      console.log('✅ Role updated to therapist');
    }

    // Create/update therapist settings document
    console.log('📝 Creating therapist settings document...');
    
    const therapistSettingsRef = doc(db, 'therapists', therapistId);
    const settingsDoc = await getDoc(therapistSettingsRef);

    const settings = {
      calendlyToken: CALENDLY_TOKEN,
      calendlyOrganizationId: CALENDLY_ORGANIZATION_URI,
      calendlyUserId: CALENDLY_USER_URI,
      syncEnabled: true,
      syncFrequencyMinutes: 10,
      eventTypeMappings: {},
      lastSync: null,
      updatedAt: new Date()
    };

    if (settingsDoc.exists()) {
      await updateDoc(therapistSettingsRef, settings);
      console.log('✅ Updated existing therapist settings');
    } else {
      await setDoc(therapistSettingsRef, {
        ...settings,
        createdAt: new Date(),
        therapistId: therapistId
      });
      console.log('✅ Created new therapist settings');
    }

    console.log('\n🎉 SUCCESS! Calendly integration is set up!\n');
    console.log('📋 Settings saved:');
    console.log('   Calendly Token: ✓ (hidden)');
    console.log('   Organization URI:', CALENDLY_ORGANIZATION_URI);
    console.log('   User URI:', CALENDLY_USER_URI);
    console.log('   Sync Enabled: true');
    console.log('   Sync Frequency: 10 minutes');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. Login to the therapist portal at http://localhost:5173/therapist/schedule');
    console.log('2. Go to Settings to verify the connection');
    console.log('3. Set up event type mappings in the Settings page');
    console.log('4. Deploy Firebase functions: firebase deploy --only functions');
    console.log('5. Configure Calendly webhook (see CALENDLY_WEBHOOK_SETUP.md)');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure you filled in all the configuration values at the top');
    console.log('2. Run GET_CALENDLY_INFO.js first to get your Calendly URIs');
    console.log('3. Check that your Firebase credentials are correct');
  }

  process.exit(0);
}

setupTherapistCalendly();
