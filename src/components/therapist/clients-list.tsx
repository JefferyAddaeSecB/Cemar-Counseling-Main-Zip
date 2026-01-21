import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Users, ChevronRight } from 'lucide-react';

interface Appointment {
  id: string;
  clientId: string;
  clientEmail?: string;
  clientName?: string;
  inviteeName?: string;
  startTime: any;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface ClientsListProps {
  appointments: Appointment[];
  therapistId: string;
}

interface Client {
  clientId: string;
  name: string;
  email: string;
  totalSessions: number;
  lastSession?: Date;
  nextSession?: Date;
}

export default function ClientsList({ appointments, therapistId }: ClientsListProps) {
  const navigate = useNavigate();

  const clients = useMemo(() => {
    const clientMap = new Map<string, Client>();

    appointments.forEach(apt => {
      const clientId = apt.clientId;
      const email = apt.clientEmail || '';
      const name = apt.clientName || apt.inviteeName || email || 'Unknown';
      const startTime = apt.startTime?.toDate?.() || new Date(apt.startTime);

      if (!clientMap.has(clientId)) {
        clientMap.set(clientId, {
          clientId,
          name,
          email,
          totalSessions: 0,
          lastSession: undefined,
          nextSession: undefined
        });
      }

      const client = clientMap.get(clientId)!;
      if (apt.status !== 'cancelled') {
        client.totalSessions++;
      }

      // Track last and next sessions
      const now = new Date();
      if (startTime <= now && apt.status === 'completed') {
        if (!client.lastSession || startTime > client.lastSession) {
          client.lastSession = startTime;
        }
      }
      if (startTime > now && apt.status === 'scheduled') {
        if (!client.nextSession || startTime < client.nextSession) {
          client.nextSession = startTime;
        }
      }
    });

    return Array.from(clientMap.values())
      .sort((a, b) => (b.nextSession?.getTime() || 0) - (a.nextSession?.getTime() || 0));
  }, [appointments]);

  const formatDate = (date?: Date) => {
    if (!date) return '—';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Clients
        </CardTitle>
        <CardDescription>{clients.length} client{clients.length !== 1 ? 's' : ''}</CardDescription>
      </CardHeader>

      <CardContent>
        {clients.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No clients yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {clients.map((client) => (
              <button
                key={client.clientId}
                onClick={() => navigate(`/therapist/clients/${client.clientId}`)}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 dark:text-white truncate group-hover:underline">
                      {client.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{client.totalSessions} session{client.totalSessions !== 1 ? 's' : ''}</span>
                      {client.nextSession && (
                        <span>Next: {formatDate(client.nextSession)}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
