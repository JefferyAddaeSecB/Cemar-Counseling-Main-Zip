/**
 * Script to make Jeffery Addae a therapist admin
 * Run this in the browser console AFTER logging in
 *
 * Steps:
 * 1. Log in with your account
 * 2. Open DevTools (F12)
 * 3. Go to Console tab
 * 4. Copy and paste this entire script
 * 5. Press Enter to run
 */

async function makeTherapistAdmin() {
  // Get current user from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const uid = userData.id;
  
  if (!uid) {
    console.error('❌ No user logged in. Please log in first.');
    return;
  }

  console.log('🔧 Starting therapist setup for:', userData.email);
  console.log('📱 UID:', uid);

  try {
    // Wait a moment for Firebase to be available
    let attempts = 0;
    while (!window.firestore && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }

    if (!window.firestore) {
      throw new Error('Firestore not available on window. Make sure you\'re on the app page.');
    }

    // Update users/{uid} to have role: "therapist"
    console.log('\n📝 Step 1: Updating users/{uid} document...');
    
    const userDocRef = window.firebaseFirestore.doc(window.firestore, 'users', uid);
    await window.firebaseFirestore.updateDoc(userDocRef, {
      role: 'therapist',
      updatedAt: new Date(),
    });
    
    console.log('✅ users/{uid} updated with role: "therapist"');

    // Try to create therapists document (may fail due to permissions)
    console.log('\n📝 Step 2: Attempting to create therapists/{uid} document...');
    
    try {
      const therapistDocRef = window.firebaseFirestore.doc(window.firestore, 'therapists', uid);
      await window.firebaseFirestore.setDoc(therapistDocRef, {
        uid: uid,
        email: userData.email,
        name: userData.name || 'Jeffery Addae',
        phone: '',
        specialization: 'Counseling',
        bio: 'CEMAR Counseling Therapist',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { merge: true });
      
      console.log('✅ therapists/{uid} created/updated');
    } catch (therapistError) {
      console.log('⚠️  therapists document creation failed (this is OK):', therapistError.message);
      console.log('💡 The therapist role is still set - you can create the therapists document manually in Firebase Console if needed');
    }

    // Update localStorage to reflect therapist role
    console.log('\n📝 Step 3: Updating local session...');
    
    userData.role = 'therapist';
    localStorage.setItem('userData', JSON.stringify(userData));
    
    console.log('✅ Local session updated');

    console.log('\n🎉 SUCCESS! You are now a therapist admin.');
    console.log('📋 Summary:');
    console.log('   - UID:', uid);
    console.log('   - Email:', userData.email);
    console.log('   - Role: therapist');
    console.log('\n💡 Tip: Refresh the page to see the therapist dashboard');
    console.log('🔗 Navigate to: /therapist/dashboard');
    
  } catch (error) {
    console.error('❌ Error making therapist:', error);
    console.error('Details:', error.message);
  }
}// Run the function
makeTherapistAdmin();
