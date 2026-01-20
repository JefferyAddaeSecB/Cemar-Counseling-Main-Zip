'use client';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser, checkIsLoggedIn } from '../../../../lib/auth-helpers';
import { firestore } from '../../../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { ArrowLeft, User, Calendar, Mail } from 'lucide-react';
import { useTheme } from '../../../../components/theme-provider';

interface Appointment {
  id: string;
  eventId: string;
  clientId: string;
  clientEmail: string;
  clientName?: string;
  inviteeName?: string;
  startTime: any;
  endTime: any;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: any;
}

export default function ClientProfilePage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = checkIsLoggedIn();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setUser(getCurrentUser());
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (!user?.uid || !clientId) return;

    // Query appointments for this client and therapist
    const q = query(
      collection(firestore, 'appointments'),
      where('therapistId', '==', user.uid),
      where('clientId', '==', clientId)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Appointment[];
      
      setAppointments(docs.sort((a, b) => {
        const aTime = a.startTime?.toDate?.() || new Date(a.startTime);
        const bTime = b.startTime?.toDate?.() || new Date(b.startTime);
        return bTime.getTime() - aTime.getTime();
      }));
    });

    return () => unsubscribe();
  }, [user?.uid, clientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const clientName = appointments[0]?.clientName || appointments[0]?.inviteeName || 'Client';
  const clientEmail = appointments[0]?.clientEmail || 'Unknown';
  
  const upcoming = appointments.filter(a => {
    const startTime = a.startTime?.toDate?.() || new Date(a.startTime);
    return startTime > new Date() && a.status === 'scheduled';
  });
  
  const completed = appointments.filter(a => a.status === 'completed');
  const cancelled = appointments.filter(a => a.status === 'cancelled');

  const nextSession = upcoming.length > 0 ? upcoming[0] : null;
  const lastSession = completed.length > 0 ? completed[0] : null;

  const formatDateTime = (timestamp: any) => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`min-h-screen transition-colors ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/therapist/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{clientName}</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {clientEmail}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Client Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{completed.length}</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Session</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {lastSession ? formatDateTime(lastSession.startTime) : 'None'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Next Session</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {nextSession ? formatDateTime(nextSession.startTime) : 'No upcoming'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Appointment History */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Appointment History
            </CardTitle>
            <CardDescription>All sessions with this client</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No appointments found
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {formatDateTime(apt.startTime)}
                      </p>
                      {apt.eventId && (
                        <p className="text-xs text-muted-foreground mt-1">ID: {apt.eventId}</p>
                      )}
                    </div>
                    <Badge
                      variant={
                        apt.status === 'completed'
                          ? 'default'
                          : apt.status === 'cancelled'
                          ? 'destructive'
                          : 'outline'
                      }
                    >
                      {apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
