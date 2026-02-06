// Calendly API sync utilities for therapist dashboard
import { collection, doc, setDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { firestore } from './firebase';

const CALENDLY_API_TOKEN = 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzcwMzk4NDM4LCJqdGkiOiJkMzIwOTMyOS1mMDEwLTQwYzEtYjJhYy1lZGVlZmUxNzBiOTkiLCJ1c2VyX3V1aWQiOiIyMDNjNTE4Yy02YWVhLTQxY2MtYmU2Mi02Yjg4MzAzMjYxYzYifQ._j6vUZlIByeu1nrBNZQ6BGm5y91Ek8qwSUradd7oB1qtLhKWpy9pMoiD7EZv7vMcH3NP_ZwZTqVxTmaHhvcFnA';
const CALENDLY_BASE_URL = 'https://api.calendly.com';

export interface CalendlyEvent {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  event_type: string;
  location?: any;
  invitees_counter: {
    total: number;
    active: number;
    limit: number;
  };
}

export interface CalendlyInvitee {
  uri: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  timezone: string;
  created_at: string;
  is_reschedule: boolean;
  payments: any[];
  cancellation?: any;
}

/**
 * Sync appointments from Calendly to Firestore
 * This runs on the client side and pulls recent appointments
 */
export async function syncCalendlyAppointments(therapistId: string): Promise<{
  created: number;
  updated: number;
  total: number;
  error?: string;
}> {
  try {
    console.log('🔄 Starting Calendly sync...');

    // 1. Get current user info
    const userResponse = await fetch(`${CALENDLY_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${CALENDLY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to get user info: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const organizationUri = userData.resource.current_organization;
    const therapistEmail = userData.resource.email;

    console.log('✅ Got user info:', therapistEmail);

    // 2. Get scheduled events from last 60 days and next 60 days
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const sixtyDaysAhead = new Date();
    sixtyDaysAhead.setDate(sixtyDaysAhead.getDate() + 60);

    const eventsResponse = await fetch(
      `${CALENDLY_BASE_URL}/scheduled_events?` +
      new URLSearchParams({
        organization: organizationUri,
        min_start_time: sixtyDaysAgo.toISOString(),
        max_start_time: sixtyDaysAhead.toISOString(),
        status: 'active',
        count: '100',
      }),
      {
        headers: {
          'Authorization': `Bearer ${CALENDLY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!eventsResponse.ok) {
      throw new Error(`Failed to get events: ${eventsResponse.statusText}`);
    }

    const eventsData = await eventsResponse.json();
    const events: CalendlyEvent[] = eventsData.collection || [];

    console.log(`✅ Found ${events.length} events from Calendly`);

    let created = 0;
    let updated = 0;

    // 3. For each event, get invitee details and sync to Firestore
    for (const event of events) {
      try {
        const eventId = event.uri.split('/').pop() || '';

        // Get invitee details
        const inviteesResponse = await fetch(`${event.uri}/invitees`, {
          headers: {
            'Authorization': `Bearer ${CALENDLY_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!inviteesResponse.ok) {
          console.warn(`Failed to get invitees for ${eventId}`);
          continue;
        }

        const inviteesData = await inviteesResponse.json();
        const invitees: CalendlyInvitee[] = inviteesData.collection || [];

        if (invitees.length === 0) {
          console.warn(`No invitees for event ${eventId}`);
          continue;
        }

        const invitee = invitees[0]; // Get first invitee

        // Check if appointment already exists
        const appointmentRef = doc(firestore, 'appointments', eventId);
        const appointmentsQuery = query(
          collection(firestore, 'appointments'),
          where('calendlyUri', '==', event.uri)
        );
        const existingDocs = await getDocs(appointmentsQuery);

        const appointmentData = {
          eventId: eventId,
          calendlyUri: event.uri,
          externalEventId: eventId,
          therapistId: therapistId,
          therapistEmail: therapistEmail,
          clientId: invitee.email,
          clientEmail: invitee.email,
          clientName: invitee.name,
          clientPhone: '', // Calendly doesn't provide phone in basic API
          serviceType: event.name,
          serviceTitle: event.name,
          startTime: Timestamp.fromDate(new Date(event.start_time)),
          endTime: Timestamp.fromDate(new Date(event.end_time)),
          duration: Math.round((new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / 60000),
          status: event.status === 'active' ? 'scheduled' : 'cancelled',
          source: 'calendly',
          timezone: invitee.timezone,
          updatedAt: Timestamp.now(),
          syncedAt: Timestamp.now(),
        };

        if (existingDocs.empty) {
          // Create new appointment
          await setDoc(appointmentRef, {
            ...appointmentData,
            createdAt: Timestamp.now(),
          });
          created++;
          console.log(`✅ Created appointment ${eventId}`);
        } else {
          // Update existing appointment
          const existingDoc = existingDocs.docs[0];
          const existingData = existingDoc.data();

          // Only update if status changed or it's a recent sync
          if (existingData.status !== appointmentData.status) {
            await setDoc(existingDoc.ref, {
              ...appointmentData,
              createdAt: existingData.createdAt, // Preserve original creation time
            }, { merge: true });
            updated++;
            console.log(`✅ Updated appointment ${eventId}`);
          }
        }
      } catch (err) {
        console.error(`Error syncing event:`, err);
      }
    }

    console.log(`✅ Sync complete: ${created} created, ${updated} updated`);

    return {
      created,
      updated,
      total: events.length,
    };
  } catch (error: any) {
    console.error('❌ Calendly sync failed:', error);
    return {
      created: 0,
      updated: 0,
      total: 0,
      error: error.message,
    };
  }
}

/**
 * Get Calendly user info
 */
export async function getCalendlyUserInfo() {
  const response = await fetch(`${CALENDLY_BASE_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${CALENDLY_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get Calendly event types (appointment types)
 */
export async function getCalendlyEventTypes() {
  const userInfo = await getCalendlyUserInfo();
  const organizationUri = userInfo.resource.current_organization;

  const response = await fetch(
    `${CALENDLY_BASE_URL}/event_types?organization=${encodeURIComponent(organizationUri)}`,
    {
      headers: {
        'Authorization': `Bearer ${CALENDLY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get event types: ${response.statusText}`);
  }

  return response.json();
}
