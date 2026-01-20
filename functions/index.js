const functions = require('firebase-functions')
const admin = require('firebase-admin')
const axios = require('axios')

admin.initializeApp()
const db = admin.firestore()

// Get Calendly API token from environment
// For local testing: set in .env.local or pass as env var
// For production: set via Firebase Secret Manager
const CALENDLY_API_TOKEN = process.env.CALENDLY_API_TOKEN || ''
const CALENDLY_BASE_URL = 'https://api.calendly.com'

// Scheduled function: runs every 10 minutes to sync Calendly events
exports.syncCalendlyEvents = functions
  .runWith({
    secrets: ['CALENDLY_API_TOKEN'],
    timeoutSeconds: 300,
    memory: '256MB'
  })
  .pubsub
  .schedule('every 10 minutes')
  .onRun(async (context) => {
    try {
      if (!CALENDLY_API_TOKEN) {
        console.error('CALENDLY_API_TOKEN not configured')
        return null
      }

      console.log('Starting Calendly sync...')

      // 1. Get current user info to find organization
      const userResponse = await axios.get(`${CALENDLY_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${CALENDLY_API_TOKEN}` },
      })

      const userUri = userResponse.data.resource.uri
      const organizationUri = userResponse.data.resource.current_organization

      console.log(`Found user: ${userUri}`)
      console.log(`Organization: ${organizationUri}`)

      // 2. Get events from last 60 days
      const sixtyDaysAgo = new Date()
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
      const minStartTime = sixtyDaysAgo.toISOString()

      const eventsResponse = await axios.get(`${CALENDLY_BASE_URL}/scheduled_events`, {
        headers: { Authorization: `Bearer ${CALENDLY_API_TOKEN}` },
        params: {
          organization: organizationUri,
          min_start_time: minStartTime,
          status: 'active', // This gets both scheduled and past events
        },
      })

      const calendlyEvents = eventsResponse.data.collection || []
      console.log(`Found ${calendlyEvents.length} events from Calendly`)

      // Get the calendar owner's email (this is the person viewing the dashboard)
      const ownerEmail = userResponse.data.resource.email
      console.log(`Calendar owner: ${ownerEmail}`)

      // Find the therapist document by email to get their UID
      let therapistId = null
      try {
        const therapistSnapshot = await db.collection('therapists').where('email', '==', ownerEmail).limit(1).get()
        if (!therapistSnapshot.empty) {
          therapistId = therapistSnapshot.docs[0].data().uid
          console.log(`Found therapist UID: ${therapistId}`)
        } else {
          console.warn(`No therapist found for email: ${ownerEmail}`)
        }
      } catch (err) {
        console.warn(`Error looking up therapist:`, err.message)
      }

      // 3. Sync each event to Firestore
      let created = 0
      let updated = 0

      for (const event of calendlyEvents) {
        const eventId = event.uri.split('/').pop()
        const appointmentRef = db.collection('appointments').doc(eventId)
        const existingDoc = await appointmentRef.get()

        // Fetch invitee details from Calendly
        let inviteeEmail = 'unknown'
        let inviteeName = event.name || 'Unknown Client'
        
        try {
          // Get invitee details using the event URI
          const inviteesResponse = await axios.get(`${event.uri}/invitees`, {
            headers: { Authorization: `Bearer ${CALENDLY_API_TOKEN}` },
          })
          
          const invitees = inviteesResponse.data.collection || []
          if (invitees.length > 0) {
            // Get the email from first invitee
            inviteeEmail = invitees[0].email || 'unknown'
            inviteeName = invitees[0].name || event.name
          }
        } catch (err) {
          console.warn(`Could not fetch invitee for event ${eventId}:`, err.message)
        }

        const appointmentData = {
          eventId: eventId,
          calendlyUri: event.uri,
          therapistId: therapistId || ownerEmail, // Use UID if found, fallback to email
          therapistEmail: ownerEmail,
          clientId: inviteeEmail, // Store the invitee's email
          clientEmail: inviteeEmail,
          inviteeName: inviteeName,
          eventName: event.name,
          startTime: admin.firestore.Timestamp.fromDate(new Date(event.start_time)),
          endTime: admin.firestore.Timestamp.fromDate(new Date(event.end_time)),
          status: event.status === 'active' ? 'scheduled' : 'cancelled',
          updatedAt: admin.firestore.Timestamp.now(),
          source: 'calendly_poll',
          createdAt: admin.firestore.Timestamp.now(),
        }

        if (!existingDoc.exists) {
          // Create new appointment
          await appointmentRef.set(appointmentData)
          created++
        } else {
          // Check if status changed
          const existingStatus = existingDoc.data().status
          if (existingStatus !== appointmentData.status) {
            await appointmentRef.update({
              status: appointmentData.status,
              updatedAt: appointmentData.updatedAt,
            })
            updated++
          }
        }
      }

      console.log(`Created: ${created}, Updated: ${updated}`)

      // 4. Calculate stats
      const now = admin.firestore.Timestamp.now()
      const allAppointmentsSnapshot = await db.collection('appointments').get()

      let totalBookings = 0
      let upcomingBookings = 0
      let cancelledBookings = 0

      allAppointmentsSnapshot.forEach(doc => {
        const appointment = doc.data()
        totalBookings++

        if (appointment.status === 'cancelled') {
          cancelledBookings++
        } else if (appointment.startTime > now) {
          upcomingBookings++
        }
      })

      // 5. Save stats
      await db.collection('stats').doc('global').set(
        {
          totalBookings,
          upcomingBookings,
          cancelledBookings,
          lastSync: admin.firestore.Timestamp.now(),
          syncType: 'calendly_poll',
        },
        { merge: true }
      )

      console.log(`Stats saved - Total: ${totalBookings}, Upcoming: ${upcomingBookings}, Cancelled: ${cancelledBookings}`)
      return null
    } catch (error) {
      console.error('Error syncing Calendly events:', error.message)
      return null
    }
  })

// Auto-complete past appointments (runs every 5 minutes)
exports.markPastAppointmentsCompleted = functions
  .runWith({
    timeoutSeconds: 300,
    memory: '256MB'
  })
  .pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now()
    const appointmentsRef = db.collection('appointments')
    const q = appointmentsRef.where('status', '==', 'scheduled').where('startTime', '<=', now).limit(500)

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
