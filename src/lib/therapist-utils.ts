import { firestore } from './firebase';
import { doc, updateDoc, query, collection, where, getDocs, Timestamp, setDoc, getDoc } from 'firebase/firestore';

// Types for Jane-like portal
export interface Appointment {
  id: string;
  // Calendly integration fields
  externalProvider: 'calendly';
  externalEventId: string;
  externalInviteeId: string;
  // Core appointment data
  therapistId: string;
  therapistEmail: string;
  clientId: string;
  clientEmail: string;
  clientName?: string;
  startTime: Timestamp;
  endTime: Timestamp;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  serviceType: string;
  meetingUrl?: string;
  // Internal fields (Jane-like features)
  internalStatus?: 'confirmed' | 'completed' | 'no-show' | 'rescheduled';
  internalNotes?: string;
  sessionNotes?: string;
  followUpNeeded?: boolean;
  // Metadata
  source: 'calendly' | 'internal';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
  rawPayload?: any; // For debugging Calendly webhooks
}

export interface Client {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  // Calendly integration
  externalInviteeIds: string[];
  // Internal fields
  internalNotes?: string;
  tags?: string[];
  preferredContactMethod?: 'email' | 'phone';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastAppointment?: Timestamp;
  totalSessions: number;
}

export interface TherapistSettings {
  calendlyToken?: string;
  calendlyOrganizationId?: string;
  eventTypeMappings: { [calendlyEventTypeId: string]: string }; // Maps Calendly event types to service types
  lastSync?: Timestamp;
  syncEnabled: boolean;
  syncFrequencyMinutes: number;
}

/**
 * Cancel an appointment
 */
export const cancelAppointment = async (appointmentId: string): Promise<void> => {
  const ref = doc(firestore, 'appointments', appointmentId);
  await updateDoc(ref, {
    status: 'cancelled',
    updatedAt: Timestamp.now()
  });
};

/**
 * Mark appointment as completed
 */
export const completeAppointment = async (appointmentId: string): Promise<void> => {
  const ref = doc(firestore, 'appointments', appointmentId);
  await updateDoc(ref, {
    status: 'completed',
    completedAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
};

/**
 * Update internal appointment status (independent of Calendly)
 */
export const updateInternalAppointmentStatus = async (
  appointmentId: string,
  internalStatus: 'confirmed' | 'completed' | 'no-show' | 'rescheduled',
  notes?: string
): Promise<void> => {
  const ref = doc(firestore, 'appointments', appointmentId);
  await updateDoc(ref, {
    internalStatus,
    internalNotes: notes,
    updatedAt: Timestamp.now()
  });
};

/**
 * Add session notes to appointment
 */
export const addSessionNotes = async (appointmentId: string, notes: string): Promise<void> => {
  const ref = doc(firestore, 'appointments', appointmentId);
  await updateDoc(ref, {
    sessionNotes: notes,
    updatedAt: Timestamp.now()
  });
};

/**
 * Get Calendly reschedule URL for an appointment
 */
export const getCalendlyRescheduleUrl = (appointment: Appointment): string => {
  // This would use Calendly's reschedule API
  // For now, return a placeholder - implement based on Calendly API docs
  return `https://calendly.com/reschedule/${appointment.externalEventId}`;
};

/**
 * Get Calendly cancel URL for an appointment
 */
export const getCalendlyCancelUrl = (appointment: Appointment): string => {
  // This would use Calendly's cancel API
  // For now, return a placeholder - implement based on Calendly API docs
  return `https://calendly.com/cancel/${appointment.externalEventId}`;
};

/**
 * Get all clients for a therapist
 */
export const getTherapistClients = async (therapistId: string): Promise<Client[]> => {
  const q = query(
    collection(firestore, 'appointments'),
    where('therapistId', '==', therapistId)
  );

  const snapshot = await getDocs(q);
  const clientMap = new Map<string, Client>();

  // Build client data from appointments
  for (const docSnap of snapshot.docs) {
    const apt = docSnap.data() as Appointment;
    const clientId = apt.clientId;

    if (!clientMap.has(clientId)) {
      // Try to get existing client document
      const clientDoc = await getDoc(doc(firestore, 'clients', clientId));
      let clientData: Client;

      if (clientDoc.exists()) {
        clientData = { id: clientDoc.id, ...clientDoc.data() } as Client;
      } else {
        // Create basic client from appointment data
        clientData = {
          id: clientId,
          email: apt.clientEmail,
          name: apt.clientName,
          externalInviteeIds: [apt.externalInviteeId],
          totalSessions: 0,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        // Save the new client
        await setDoc(doc(firestore, 'clients', clientId), clientData);
      }

      clientMap.set(clientId, clientData);
    }

    // Update session count and last appointment
    const client = clientMap.get(clientId)!;
    client.totalSessions++;
    if (!client.lastAppointment || apt.startTime > client.lastAppointment) {
      client.lastAppointment = apt.startTime;
    }
  }

  return Array.from(clientMap.values());
};

/**
 * Update client information
 */
export const updateClient = async (clientId: string, updates: Partial<Client>): Promise<void> => {
  const ref = doc(firestore, 'clients', clientId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

/**
 * Add internal notes to client
 */
export const addClientNotes = async (clientId: string, notes: string): Promise<void> => {
  const ref = doc(firestore, 'clients', clientId);
  const currentDoc = await getDoc(ref);
  const currentNotes = currentDoc.data()?.internalNotes || '';

  await updateDoc(ref, {
    internalNotes: currentNotes + '\n\n' + new Date().toISOString() + ': ' + notes,
    updatedAt: Timestamp.now()
  });
};

/**
 * Get therapist settings
 */
export const getTherapistSettings = async (therapistId: string): Promise<TherapistSettings | null> => {
  const ref = doc(firestore, 'therapists', therapistId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    calendlyToken: data.calendlyToken,
    calendlyOrganizationId: data.calendlyOrganizationId,
    eventTypeMappings: data.eventTypeMappings || {},
    lastSync: data.lastSync,
    syncEnabled: data.syncEnabled ?? false,
    syncFrequencyMinutes: data.syncFrequencyMinutes ?? 10,
  };
};

/**
 * Update therapist settings
 */
export const updateTherapistSettings = async (therapistId: string, settings: Partial<TherapistSettings>): Promise<void> => {
  const ref = doc(firestore, 'therapists', therapistId);
  await updateDoc(ref, {
    ...settings,
    updatedAt: Timestamp.now()
  });
};

/**
 * Get therapist info
 */
export const getTherapistInfo = async (therapistId: string) => {
  try {
    const ref = doc(firestore, 'therapists', therapistId);
    const docSnap = await getDocs(query(collection(firestore, 'therapists'), where('uid', '==', therapistId)));
    
    if (!docSnap.empty) {
      return docSnap.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error('Error getting therapist info:', error);
    return null;
  }
};

/**
 * Get reschedule URL for Calendly
 * This would typically redirect to: https://calendly.com/user/reschedule/{event_uuid}
 */
export const getRescheduleUrl = (eventId: string, calendarlyUsername: string): string => {
  return `https://calendly.com/${calendarlyUsername}/reschedule/${eventId}`;
};

/**
 * Format date/time for display
 */
export const formatAppointmentTime = (timestamp: any): string => {
  const date = timestamp?.toDate?.() || new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get appointments for a date range
 */
export const getAppointmentsForDateRange = (
  appointments: any[],
  startDate: Date,
  endDate: Date,
  therapistId: string
) => {
  return appointments.filter(apt => {
    const aptTime = apt.startTime?.toDate?.() || new Date(apt.startTime);
    return (
      apt.therapistId === therapistId &&
      aptTime >= startDate &&
      aptTime <= endDate &&
      apt.status === 'scheduled'
    );
  });
};
