'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, checkIsLoggedIn } from '../../../lib/auth-helpers';
import { firestore } from '../../../lib/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useTheme } from '../../../components/theme-provider';
import TodaySchedule from '../../../components/therapist/today-schedule';
import UpcomingAppointments from '../../../components/therapist/upcoming-appointments';
import ClientsList from '../../../components/therapist/clients-list';
import StatsBar from '../../../components/therapist/stats-bar';

interface Appointment {
  id: string;
  eventId: string;
  therapistId: string;
  therapistEmail: string;
  clientId: string;
  clientEmail: string;
  startTime: any;
  endTime: any;
  status: 'scheduled' | 'completed' | 'cancelled';
  source: string;
  createdAt: any;
  clientName?: string;
  inviteeName?: string;
}

export default function TherapistDashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authorization
  useEffect(() => {
    const isLoggedIn = checkIsLoggedIn();
    if (!isLoggedIn) {
      navigate('/login?tab=signup');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Check if user has therapist role (from custom claims or user doc)
    // For now, redirect to home if no appointments (new user)
    setUser(currentUser);
    setLoading(false);
  }, [navigate]);

  // Real-time listener for therapist's appointments
  useEffect(() => {
    if (!user?.uid) return;

    // Query appointments where therapist is logged in user
    const q = query(
      collection(firestore, 'appointments'),
      where('therapistId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Appointment[];
      
      setAppointments(docs);
      
      // If no appointments, redirect to home to complete profile setup
      if (docs.length === 0 && !loading) {
        // Optionally redirect after a delay, or stay on dashboard
        // navigate('/');
      }
    }, (err) => {
      setError(err.message);
    });

    return () => unsubscribe();
  }, [user?.uid, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Therapist Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.displayName || user?.email}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950">
            <CardContent className="pt-6">
              <p className="text-red-700 dark:text-red-200">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Stats Bar */}
        <StatsBar appointments={appointments} />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Primary: Today's Schedule (2 columns) */}
          <div className="lg:col-span-2">
            <TodaySchedule appointments={appointments} therapistId={user?.uid} />
          </div>

          {/* Secondary: Clients List (1 column) */}
          <div>
            <ClientsList appointments={appointments} therapistId={user?.uid} />
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="mt-8">
          <UpcomingAppointments appointments={appointments} therapistId={user?.uid} />
        </div>
      </div>
    </div>
  );
}
