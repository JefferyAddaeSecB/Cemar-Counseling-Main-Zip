import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar } from 'lucide-react';

interface Appointment {
  id: string;
  startTime: any;
  endTime: any;
  status: 'scheduled' | 'completed' | 'cancelled';
  clientEmail?: string;
  clientName?: string;
  inviteeName?: string;
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  therapistId: string;
}

export default function UpcomingAppointments({ appointments, therapistId }: UpcomingAppointmentsProps) {
  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    return appointments
      .filter(a => {
        const startTime = a.startTime?.toDate?.() || new Date(a.startTime);
        return startTime > endOfToday && startTime <= sevenDaysFromNow && a.status === 'scheduled';
      })
      .sort((a, b) => {
        const aTime = a.startTime?.toDate?.() || new Date(a.startTime);
        const bTime = b.startTime?.toDate?.() || new Date(b.startTime);
        return aTime - bTime;
      });
  }, [appointments]);

  const groupedByDate = useMemo(() => {
    const groups: { [key: string]: typeof upcomingAppointments } = {};
    upcomingAppointments.forEach(apt => {
      const date = (apt.startTime?.toDate?.() || new Date(apt.startTime)).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(apt);
    });
    return groups;
  }, [upcomingAppointments]);

  const formatTime = (timestamp: any) => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Upcoming Appointments (Next 7 Days)
        </CardTitle>
        <CardDescription>
          {upcomingAppointments.length} appointment{upcomingAppointments.length !== 1 ? 's' : ''} scheduled
        </CardDescription>
      </CardHeader>

      <CardContent>
        {upcomingAppointments.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No appointments scheduled for the next 7 days</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([dateStr, dayAppointments]) => (
              <div key={dateStr}>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  {formatDate(dateStr)}
                </h3>
                <div className="space-y-2 pl-4 border-l border-slate-200 dark:border-slate-700">
                  {dayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div>
                        <p className="font-medium text-sm text-slate-900 dark:text-white">
                          {formatTime(apt.startTime)} · {apt.clientName || apt.inviteeName || apt.clientEmail || 'Unknown'}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Scheduled
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
