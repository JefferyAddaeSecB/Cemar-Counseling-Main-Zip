import { useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Appointment {
  startTime: any;
  endTime: any;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface StatsBarProps {
  appointments: Appointment[];
}

export default function StatsBar({ appointments }: StatsBarProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const total = appointments.filter(a => a.status === 'scheduled').length;
    const today = appointments.filter(a => {
      const startTime = a.startTime?.toDate?.() || new Date(a.startTime);
      return startTime >= startOfToday && startTime < endOfToday && a.status === 'scheduled';
    }).length;
    const upcoming = appointments.filter(a => {
      const startTime = a.startTime?.toDate?.() || new Date(a.startTime);
      return startTime > now && a.status === 'scheduled';
    }).length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;

    return { total, today, upcoming, cancelled };
  }, [appointments]);

  const statCards = [
    {
      label: 'Total Appointments',
      value: stats.total,
      icon: Calendar,
      color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
    },
    {
      label: "Today's Sessions",
      value: stats.today,
      icon: Clock,
      color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
    },
    {
      label: 'Upcoming (7 Days)',
      value: stats.upcoming,
      icon: CheckCircle2,
      color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400'
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      icon: XCircle,
      color: 'bg-red-500/10 text-red-700 dark:text-red-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="border-slate-200 dark:border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
