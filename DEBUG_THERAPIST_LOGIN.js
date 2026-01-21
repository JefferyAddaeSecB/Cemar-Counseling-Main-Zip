// This is a debugging script to check your Firestore data structure
// Run this in your browser console while logged in as the therapist

async function debugTherapistData() {
  console.log('🔍 DEBUGGING THERAPIST LOGIN ISSUE\n');
  
  // Get current user from localStorage
  const userData = localStorage.getItem('userData');
  if (!userData) {
    console.error('❌ No userData in localStorage');
    return;
  }
  
  const user = JSON.parse(userData);
  console.log('📱 Current User from localStorage:', user);
  console.log('   - ID:', user.id);
  console.log('   - Email:', user.email);
  console.log('   - Role:', user.role);
  
  // Get auth user
  const { auth } = window.__FIREBASE__;
  if (!auth || !auth.currentUser) {
    console.error('❌ Not logged in to Firebase');
    return;
  }
  
  const authUser = auth.currentUser;
  console.log('\n🔐 Firebase Auth User:', {
    uid: authUser.uid,
    email: authUser.email,
    displayName: authUser.displayName
  });
  
  // Now check Firestore
  const { firestore } = window.__FIREBASE__;
  const { doc, getDoc } = window.firebaseFirestore;
  
  if (!firestore) {
    console.error('❌ Firestore not initialized');
    return;
  }
  
  console.log('\n📋 Checking Firestore users/{uid} document...');
  const userDocRef = doc(firestore, 'users', authUser.uid);
  const userDocSnap = await getDoc(userDocRef);
  
  if (userDocSnap.exists()) {
    const firestoreUser = userDocSnap.data();
    console.log('✅ Document found:', firestoreUser);
    console.log('   - role field:', firestoreUser.role);
    console.log('   - email field:', firestoreUser.email);
    console.log('   - name field:', firestoreUser.name);
  } else {
    console.error('❌ No Firestore document found for UID:', authUser.uid);
  }
  
  console.log('\n📋 Checking Firestore therapists/{uid} document...');
  const therapistDocRef = doc(firestore, 'therapists', authUser.uid);
  const therapistDocSnap = await getDoc(therapistDocRef);
  
  if (therapistDocSnap.exists()) {
    const therapistData = therapistDocSnap.data();
    console.log('✅ Therapist document found:', therapistData);
  } else {
    console.warn('⚠️  No therapist document found for UID:', authUser.uid);
  }
}

// Call it
debugTherapistData();
