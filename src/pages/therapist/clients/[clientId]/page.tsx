'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser, checkIsLoggedIn } from '@/lib/auth-helpers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Settings, ArrowLeft, Mail, Phone, Clock, FileText, Tag } from 'lucide-react';
import { Client, updateClient, addClientNotes } from '@/lib/therapist-utils';
import { firestore } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import TherapistSidebarNav from '@/components/therapist/sidebar-nav';

interface ClientAppointment {
  id: string;
  startTime: Timestamp;
  endTime: Timestamp;
  status: string;
  serviceType: string;
  internalNotes?: string;
  sessionNotes?: string;
}

export default function ClientProfilePage() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newNote, setNewNote] = useState('');

  // Check authorization
  useEffect(() => {
    const isLoggedIn = checkIsLoggedIn();
    if (!isLoggedIn) {
      navigate('/login?tab=signup');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'therapist') {
      navigate('/login');
      return;
    }

    setUser(currentUser);
  }, [navigate]);

  // Load client data
  useEffect(() => {
    if (!user?.id || !clientId) return;

    const loadClientData = async () => {
      try {
        // Load client profile
        const clientDoc = await getDocs(query(collection(firestore, 'clients'), where('__name__', '==', clientId)));
        if (!clientDoc.empty) {
          const clientData = { id: clientDoc.docs[0].id, ...clientDoc.docs[0].data() } as Client;
          setClient(clientData);
        }

        // Load client appointments
        const appointmentsQuery = query(
          collection(firestore, 'appointments'),
          where('therapistId', '==', user.id),
          where('clientId', '==', clientId)
        );
        const appointmentsSnap = await getDocs(appointmentsQuery);
        const appointmentsData = appointmentsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ClientAppointment[];

        setAppointments(appointmentsData.sort((a, b) =>
          b.startTime.toMillis() - a.startTime.toMillis()
        ));
      } catch (error) {
        console.error('Error loading client data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClientData();
  }, [user?.id, clientId]);

  const handleSaveClient = async () => {
    if (!client) return;

    setSaving(true);
    try {
      await updateClient(client.id, {
        name: client.name,
        phone: client.phone,
        preferredContactMethod: client.preferredContactMethod,
        tags: client.tags,
      });
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!client || !newNote.trim()) return;

    setSaving(true);
    try {
      await addClientNotes(client.id, newNote);
      setNewNote('');
      // Refresh client data
      const updatedClient = { ...client };
      updatedClient.internalNotes = (client.internalNotes || '') + '\n\n' + new Date().toISOString() + ': ' + newNote;
      setClient(updatedClient);
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Client Not Found</h2>
          <Button onClick={() => navigate('/therapist/clients')}>
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <TherapistSidebarNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/therapist/clients')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {client.name || 'Unnamed Client'}
                </h2>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
            </div>
            <Button onClick={handleSaveClient} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Client Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={client.name || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClient((prev: Client | null) => prev ? { ...prev, name: e.target.value } : null)}
                      placeholder="Client's full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={client.email}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={client.phone || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClient((prev: Client | null) => prev ? { ...prev, phone: e.target.value } : null)}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactMethod">Preferred Contact</Label>
                    <Select
                      value={client.preferredContactMethod || 'email'}
                      onValueChange={(value: string) => setClient((prev: Client | null) => prev ? { ...prev, preferredContactMethod: value as 'email' | 'phone' } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSaveClient} disabled={saving} className="w-full">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Sessions</span>
                    <span className="font-medium">{client.totalSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Appointment</span>
                    <span className="font-medium">
                      {client.lastAppointment
                        ? client.lastAppointment.toDate().toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Appointments & Notes */}
            <div className="lg:col-span-2 space-y-6">
              {/* Appointments History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Appointment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appointments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No appointments yet</p>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map(apt => (
                        <div key={apt.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">
                                {apt.startTime.toDate().toLocaleDateString()} at{' '}
                                {apt.startTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="text-sm text-gray-600">{apt.serviceType}</div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                              apt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                          {apt.sessionNotes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <strong>Session Notes:</strong> {apt.sessionNotes}
                            </div>
                          )}
                          {apt.internalNotes && (
                            <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                              <strong>Internal Notes:</strong> {apt.internalNotes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Internal Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Internal Notes
                  </CardTitle>
                  <CardDescription>
                    Private notes visible only to you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={newNote}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewNote(e.target.value)}
                    placeholder="Add a new note..."
                    rows={3}
                  />
                  <Button onClick={handleAddNote} disabled={saving || !newNote.trim()}>
                    {saving ? 'Adding...' : 'Add Note'}
                  </Button>

                  {client.internalNotes && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Note History</h4>
                      <div className="text-sm text-gray-700 whitespace-pre-line">
                        {client.internalNotes}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
