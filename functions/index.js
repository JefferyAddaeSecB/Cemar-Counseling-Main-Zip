const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()
const db = admin.firestore()

// Scheduled function: every 5 minutes mark past appointments as 'completed'
exports.markPastAppointmentsCompleted = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now()
    const appointmentsRef = db.collection('appointments')
    const q = appointmentsRef.where('status', '==', 'upcoming').where('startTime', '<=', now).limit(500)

    const snapshot = await q.get()
    if (snapshot.empty) {
      console.log('No past appointments to update')
      return null
    }

    const batch = db.batch()
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { status: 'completed', completedAt: admin.firestore.Timestamp.now() })
    })

    await batch.commit()
    console.log(`Marked ${snapshot.size} appointments as completed`)
    return null
  })
