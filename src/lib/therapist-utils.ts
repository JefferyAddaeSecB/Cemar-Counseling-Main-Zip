import { firestore } from './firebase';
import { doc, updateDoc, query, collection, where, getDocs, Timestamp } from 'firebase/firestore';

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
 * Get all clients for a therapist
 */
export const getTherapistClients = async (therapistId: string) => {
  const q = query(
    collection(firestore, 'appointments'),
    where('therapistId', '==', therapistId)
  );
  
  const snapshot = await getDocs(q);
  const clients = new Map();
  
  snapshot.forEach(doc => {
    const apt = doc.data();
    const clientId = apt.clientId;
    
    if (!clients.has(clientId)) {
      clients.set(clientId, {
        clientId,
        email: apt.clientEmail,
        name: apt.clientName || apt.inviteeName || apt.clientEmail,
        totalSessions: 0,
        lastSession: null,
        nextSession: null
      });
    }
    
    const client = clients.get(clientId);
    client.totalSessions++;
    
    const startTime = apt.startTime?.toDate?.() || new Date(apt.startTime);
    
    if (apt.status === 'completed') {
      if (!client.lastSession || startTime > client.lastSession) {
        client.lastSession = startTime;
      }
    }
    
    const now = new Date();
    if (startTime > now && apt.status === 'scheduled') {
      if (!client.nextSession || startTime < client.nextSession) {
        client.nextSession = startTime;
      }
    }
  });
  
  return Array.from(clients.values());
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
