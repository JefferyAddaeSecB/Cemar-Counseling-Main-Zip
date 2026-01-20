# Therapist Dashboard Setup Guide

## Overview
The therapist dashboard is a Jane-inspired, role-based interface that allows therapists to manage their appointments and clients in real-time.

## Features

### 1. **Therapist Dashboard** (`/therapist/dashboard`)
- **Today's Schedule**: Appointments scheduled for today with times, durations, and client names
- **Stats Bar**: Real-time counts of total, today's, upcoming (7 days), and cancelled appointments
- **Upcoming Appointments**: Next 7 days grouped by date
- **Clients List**: Sidebar showing all clients with total sessions and next appointment date

### 2. **Client Profile** (`/therapist/clients/[clientId]`)
- Client information and contact details
- Total completed sessions
- Last session date/time
- Next upcoming session
- Full appointment history with status badges

### 3. **Real-Time Updates**
- All components use `onSnapshot()` for live updates
- Changes reflect instantly when:
  - New appointments are synced from Calendly (every 10 minutes)
  - Appointments are cancelled
  - Appointments are marked completed
  - Cloud Function updates appointment data

## Firestore Schema

### Collections Required

```
users/{uid}
├── uid: string
├── email: string
├── role: "therapist" | "client"
└── name: string

therapists/{uid}
├── uid: string
├── email: string
├── name: string
└── active: boolean

appointments/{eventId}
├── eventId: string
├── therapistId: string (UID of therapist)
├── therapistEmail: string
├── clientId: string (UID of client)
├── clientEmail: string
├── startTime: Timestamp
├── endTime: Timestamp
├── status: "scheduled" | "completed" | "cancelled"
├── source: "calendly"
├── createdAt: Timestamp
├── updatedAt: Timestamp
└── completedAt: Timestamp (optional)
```

## Firestore Security Rules

The dashboard uses these rules:
- Therapists can only see appointments where `therapistId == request.auth.uid`
- Clients can only see appointments where `clientId == request.auth.uid`
- Therapists can update/cancel their own appointments
- Cloud Functions can write appointment data (via service account)

## Setup Steps

### 1. Enable Therapist Role
When a user creates an account, set their role in Firestore:

```javascript
// In your signup/auth flow
const userDoc = {
  uid: user.uid,
  email: user.email,
  role: "therapist", // or "client"
  name: user.displayName || "New Therapist",
  createdAt: new Date()
};

await setDoc(doc(firestore, 'users', user.uid), userDoc);
```

### 2. Create Therapist Profile
When therapist logs in for first time:

```javascript
const therapistDoc = {
  uid: user.uid,
  email: user.email,
  name: user.displayName || user.email,
  active: true,
  createdAt: new Date()
};

await setDoc(doc(firestore, 'therapists', user.uid), therapistDoc);
```

### 3. Route Protection
Use `ProtectedRoute` component to protect therapist routes:

```jsx
import ProtectedRoute from '@/components/therapist/protected-route';

<ProtectedRoute requiredRole="therapist">
  <TherapistDashboard />
</ProtectedRoute>
```

### 4. Cloud Function Updates
Ensure the `syncCalendlyEvents` Cloud Function stores:
- `therapistId`: The UID of the calendar owner (needs mapping)
- `therapistEmail`: The therapist's email
- `clientId`: The invitee's UID or email
- `clientEmail`: The invitee's email

**Note**: Currently, the Cloud Function stores `clientId` as email. To use UIDs:
1. Create a mapping of email → UID
2. Or use email as the identifier (simpler, recommended for now)

## Usage

### For Therapists:
1. Log in with therapist account
2. Redirected to `/therapist/dashboard`
3. See today's schedule, stats, and clients
4. Click client name to view their profile
5. Click Edit or Cancel buttons to manage appointments

### For Clients:
1. Log in with client account
2. Redirected to client dashboard (existing)
3. See their own appointments

## API Endpoints

### Query Therapist's Appointments
```javascript
const q = query(
  collection(firestore, 'appointments'),
  where('therapistId', '==', therapistUid)
);

onSnapshot(q, (snap) => {
  const appointments = snap.docs.map(d => d.data());
});
```

### Cancel Appointment
```javascript
import { cancelAppointment } from '@/lib/therapist-utils';

await cancelAppointment(appointmentId);
```

### Get Therapist's Clients
```javascript
import { getTherapistClients } from '@/lib/therapist-utils';

const clients = await getTherapistClients(therapistUid);
```

## Component Documentation

### `<TherapistDashboard />`
Main dashboard page. Displays:
- Stats bar with appointment counts
- Today's schedule (left column, 2/3 width)
- Clients list (right column, 1/3 width)
- Upcoming appointments (full width below)

**Props**: None (reads from auth context)

### `<TodaySchedule />`
Shows appointments for today with:
- Time, duration, client name
- Status badge
- Edit and Cancel buttons

**Props**:
- `appointments: Appointment[]` - Array of appointments
- `therapistId: string` - Current therapist's UID

### `<UpcomingAppointments />`
Shows next 7 days grouped by date.

**Props**: Same as TodaySchedule

### `<ClientsList />`
Shows unique clients with:
- Name, email
- Total sessions count
- Next appointment date

Clicking a client navigates to their profile.

**Props**: Same as TodaySchedule

### `<ClientProfile />`
Shows detailed client information and appointment history.

**Route**: `/therapist/clients/:clientId`

## Customization

### Styling
- Uses Tailwind CSS and Shadcn/ui components
- Theme-aware (dark/light mode via `useTheme()`)
- Colors: Blue (info), Emerald (success), Red (danger), Purple (upcoming)

### Real-Time Behavior
- Default refresh interval: Immediate on Firestore changes
- Manual refresh: Use the "Refresh" button
- Polling: Cloud Function syncs Calendly every 10 minutes

### Date/Time Formatting
Use utilities from `therapist-utils.ts`:
```javascript
import { formatAppointmentTime } from '@/lib/therapist-utils';

const formatted = formatAppointmentTime(appointment.startTime);
// Output: "Mon, Jan 20, 02:30 PM"
```

## Troubleshooting

### Dashboard shows no appointments
1. Check if therapist UID is set correctly in appointments
2. Verify Firestore rules allow read access
3. Check Cloud Function logs in Firebase Console
4. Ensure Calendly API token is valid (check functions/.env.local)

### Client profile not loading
1. Verify `clientId` in appointments matches the URL param
2. Check Firestore rules for client read access

### Real-time updates not working
1. Confirm Firestore listener is active (no errors in console)
2. Check network connection
3. Verify Firestore rules allow read access

## Future Enhancements

- [ ] Bulk appointment actions (cancel multiple)
- [ ] Notes/observations per appointment
- [ ] Client outcome tracking
- [ ] Therapist availability settings
- [ ] Email notifications for new bookings
- [ ] Appointment rescheduling via Calendly
- [ ] Reports and analytics
- [ ] Team/group practice support

## Security Considerations

✅ **Implemented**:
- Role-based access control
- Therapist data isolation (only see own appointments)
- Client data isolation (only see own appointments)
- Firestore rules enforce access control

⚠️ **To Implement**:
- Rate limiting on appointment updates
- Audit logging for cancellations
- Backup/recovery procedures
- Data export for therapists
