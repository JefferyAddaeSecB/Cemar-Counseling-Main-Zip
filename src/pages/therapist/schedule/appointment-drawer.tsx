'use client';

import { useState } from 'react';
import { X, Calendar, Clock, User, MapPin, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Appointment, updateInternalAppointmentStatus, addSessionNotes, getCalendlyRescheduleUrl, getCalendlyCancelUrl } from '@/lib/therapist-utils';

interface AppointmentDrawerProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentDrawer({ appointment, isOpen, onClose }: AppointmentDrawerProps) {
  const [internalStatus, setInternalStatus] = useState(appointment.internalStatus || 'confirmed');
  const [internalNotes, setInternalNotes] = useState(appointment.internalNotes || '');
  const [sessionNotes, setSessionNotes] = useState(appointment.sessionNotes || '');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleStatusChange = async (status: string) => {
    setSaving(true);
    try {
      await updateInternalAppointmentStatus(appointment.id, status as any, internalNotes);
      setInternalStatus(status as 'confirmed' | 'completed' | 'no-show' | 'rescheduled');
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await addSessionNotes(appointment.id, sessionNotes);
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReschedule = () => {
    const url = getCalendlyRescheduleUrl(appointment);
    window.open(url, '_blank');
  };

  const handleCancel = () => {
    const url = getCalendlyCancelUrl(appointment);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-96 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Appointment Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <User className="w-4 h-4 mr-2" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Name:</span> {appointment.clientName || 'Not provided'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Email:</span> {appointment.clientEmail}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3"
                onClick={() => window.open(`/therapist/clients/${appointment.clientId}`, '_blank')}
              >
                Open Client Profile
              </Button>
            </CardContent>
          </Card>

          {/* Appointment Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Service:</span> {appointment.serviceType}
              </div>
              <div className="text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span className="font-medium">Time:</span>{' '}
                {appointment.startTime?.toDate().toLocaleString()} - {appointment.endTime?.toDate().toLocaleTimeString()}
              </div>
              <div className="text-sm">
                <span className="font-medium">Status:</span>{' '}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
              {appointment.meetingUrl && (
                <div className="text-sm">
                  <span className="font-medium">Meeting:</span>{' '}
                  <a
                    href={appointment.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    Join Meeting <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Internal Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Internal Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={internalStatus} onValueChange={handleStatusChange} disabled={saving}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Internal notes..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                onBlur={() => handleStatusChange(internalStatus)}
                disabled={saving}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Session Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Session Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add session notes..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                onBlur={handleSaveNotes}
                disabled={saving}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleReschedule}
              className="w-full"
              variant="outline"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Reschedule via Calendly
            </Button>
            <Button
              onClick={handleCancel}
              className="w-full"
              variant="destructive"
            >
              Cancel via Calendly
            </Button>
          </div>

          {/* Calendly Integration Info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <div className="font-medium mb-1">Calendly Integration</div>
            <div>Event ID: {appointment.externalEventId}</div>
            <div>Invitee ID: {appointment.externalInviteeId}</div>
            <div>Source: {appointment.source}</div>
          </div>
        </div>
      </div>
    </div>
  );
}