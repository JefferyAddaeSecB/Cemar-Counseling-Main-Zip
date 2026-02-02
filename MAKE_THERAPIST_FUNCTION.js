/**
 * Cloud Function to make a user a therapist
 * Deploy with: firebase deploy --only functions
 * 
 * Call with: 
 * firebase functions:call makeUserTherapist --data '{"email":"jefferyaddae@example.com"}'
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.makeUserTherapist = functions.https.onCall(async (data, context) => {
  // Verify caller is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be logged in to use this function'
    );
  }

  const { email } = data;

  if (!email) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Email is required'
    );
  }

  try {
    console.log(`🔧 Making ${email} a therapist...`);

    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    console.log(`📱 Found user with UID: ${uid}`);

    // Update users/{uid} with therapist role
    console.log('📝 Updating users/{uid}...');
    await admin.firestore().collection('users').doc(uid).update({
      role: 'therapist',
      updatedAt: admin.firestore.Timestamp.now(),
    });

    // Create therapists/{uid} document
    console.log('📝 Creating therapists/{uid}...');
    await admin.firestore().collection('therapists').doc(uid).set(
      {
        uid: uid,
        email: email,
        name: userRecord.displayName || 'Therapist',
        phone: '',
        specialization: 'Counseling',
        bio: 'CEMAR Counseling Therapist',
        active: true,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      { merge: true }
    );

    console.log('✅ SUCCESS! User is now a therapist.');

    return {
      success: true,
      message: `${email} is now a therapist`,
      uid: uid,
      email: email,
    };

  } catch (error) {
    console.error('❌ Error:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to make therapist: ${error.message}`
    );
  }
});
