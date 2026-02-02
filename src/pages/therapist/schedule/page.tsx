'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, checkIsLoggedIn } from '@/lib/auth-helpers';
import { firestore } from '@/lib/firebase';
import { collection, query, where, onSnapshot, Timestamp, doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Calendar, Clock, Users, Settings, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppointmentDrawer } from '@/pages/therapist/schedule/appointment-drawer';
import { Appointment, getTherapistClients } from '@/lib/therapist-utils';
import TherapistSidebarNav from '@/components/therapist/sidebar-nav';

type ViewMode = 'day' | 'week' | 'agenda';

export default function TherapistSchedulePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    setLoading(false);
  }, [navigate]);

  // Real-time listener for therapist's appointments
  useEffect(() => {
    if (!user?.id) return;

    const q = query(
      collection(firestore, 'appointments'),
      where('therapistId', '==', user.id)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Appointment[];

      setAppointments(docs);
    }, (err) => {
      setError(err.message);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const filteredAppointments = appointments.filter(apt =>
    searchQuery === '' ||
    apt.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.serviceType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <TherapistSidebarNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-medium text-gray-900">
                {viewMode === 'day' && 'Today'}
                {viewMode === 'week' && 'This Week'}
                {viewMode === 'agenda' && 'Agenda'}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToToday}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex rounded-md border border-gray-300">
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-2 text-sm font-medium ${
                    viewMode === 'day' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                  } rounded-l-md`}
                >
                  Day
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-2 text-sm font-medium ${
                    viewMode === 'week' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('agenda')}
                  className={`px-3 py-2 text-sm font-medium ${
                    viewMode === 'agenda' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                  } rounded-r-md`}
                >
                  Agenda
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Content */}
        <div className="flex-1 p-6 overflow-auto">
          {viewMode === 'week' && (
            <div className="grid grid-cols-7 gap-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                const dayDate = new Date(currentDate);
                dayDate.setDate(currentDate.getDate() - currentDate.getDay() + index);

                const dayAppointments = filteredAppointments.filter(apt => {
                  const aptDate = apt.startTime?.toDate();
                  return aptDate && aptDate.toDateString() === dayDate.toDateString();
                });

                return (
                  <div key={day} className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-medium text-gray-900 mb-3">
                      {day} {dayDate.getDate()}
                    </h3>
                    <div className="space-y-2">
                      {dayAppointments.map(apt => (
                        <button
                          key={apt.id}
                          onClick={() => setSelectedAppointment(apt)}
                          className="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded border-l-4 border-blue-600"
                        >
                          <div className="text-sm font-medium text-gray-900">
                            {apt.startTime?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-sm text-gray-600 truncate">
                            {apt.clientName || apt.clientEmail}
                          </div>
                          <div className="text-xs text-gray-500">
                            {apt.serviceType}
                          </div>
                        </button>
                      ))}
                      {dayAppointments.length === 0 && (
                        <div className="text-sm text-gray-400 py-4">No appointments</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'agenda' && (
            <div className="space-y-4">
              {filteredAppointments
                .sort((a, b) => (a.startTime?.toMillis() || 0) - (b.startTime?.toMillis() || 0))
                .map(apt => (
                  <Card key={apt.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4" onClick={() => setSelectedAppointment(apt)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium text-gray-900">
                            {apt.startTime?.toDate().toLocaleDateString()} at {apt.startTime?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-sm text-gray-600">
                            {apt.clientName || apt.clientEmail}
                          </div>
                          <div className="text-sm text-gray-500">
                            {apt.serviceType}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            apt.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                            apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {filteredAppointments.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                  <p className="text-gray-500">Try adjusting your search or date range.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Appointment Drawer */}
      {selectedAppointment && (
        <AppointmentDrawer
          appointment={selectedAppointment}
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}