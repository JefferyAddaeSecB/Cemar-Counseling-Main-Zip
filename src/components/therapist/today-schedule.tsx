import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import { Badge } from '../../ui/badge';
import { Clock, User, Trash2, Edit2 } from 'lucide-react';
import { firestore } from '../../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface Appointment {
  id: string;
  startTime: any;
  endTime: any;
  status: 'scheduled' | 'completed' | 'cancelled';
  clientEmail?: string;
  clientName?: string;
  inviteeName?: string;
  eventName?: string;
}

interface TodayScheduleProps {
  appointments: Appointment[];
  therapistId: string;
}

export default function TodaySchedule({ appointments, therapistId }: TodayScheduleProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const todayAppointments = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    return appointments
      .filter(a => {
        const startTime = a.startTime?.toDate?.() || new Date(a.startTime);
        return startTime >= startOfToday && startTime < endOfToday && a.status === 'scheduled';
      })
      .sort((a, b) => {
        const aTime = a.startTime?.toDate?.() || new Date(a.startTime);
        const bTime = b.startTime?.toDate?.() || new Date(b.startTime);
        return aTime - bTime;
      });
  }, [appointments]);

  const handleCancel = async (appointmentId: string) => {
    setLoadingId(appointmentId);
    try {
      const ref = doc(firestore, 'appointments', appointmentId);
      await updateDoc(ref, { status: 'cancelled' });
      setCancellingId(null);
    } catch (err) {
      console.error('Error cancelling appointment:', err);
    } finally {
      setLoadingId(null);
    }
  };

  const formatTime = (timestamp: any) => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (start: any, end: any) => {
    const startDate = start?.toDate?.() || new Date(start);
    const endDate = end?.toDate?.() || new Date(end);
    const minutes = (endDate - startDate) / (1000 * 60);
    return `${Math.round(minutes)} min`;
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Today's Schedule
        </CardTitle>
        <CardDescription>
          {todayAppointments.length} appointment{todayAppointments.length !== 1 ? 's' : ''} today
        </CardDescription>
      </CardHeader>

      <CardContent>
        {todayAppointments.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No appointments scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatTime(apt.startTime)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(apt.startTime, apt.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {apt.clientName || apt.inviteeName || apt.clientEmail || 'Unknown Client'}
                    </span>
                  </div>
                  {apt.eventName && (
                    <p className="text-xs text-muted-foreground mt-1">{apt.eventName}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Scheduled
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                    title="View/Reschedule"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => setCancellingId(apt.id)}
                    title="Cancel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!cancellingId} onOpenChange={(open) => !open && setCancellingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The client will be notified of the cancellation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancellingId && handleCancel(cancellingId)}
              disabled={loadingId === cancellingId}
              className="bg-red-600 hover:bg-red-700"
            >
              {loadingId === cancellingId ? 'Cancelling...' : 'Cancel Appointment'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
