'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, checkIsLoggedIn } from '@/lib/auth-helpers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar, Users, Settings, ExternalLink, RefreshCw, FileText } from 'lucide-react';
import { TherapistSettings, getTherapistSettings, updateTherapistSettings } from '@/lib/therapist-utils';
import TherapistSidebarNav from '@/components/therapist/sidebar-nav';

export default function TherapistSettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<TherapistSettings>({
    eventTypeMappings: {},
    syncEnabled: false,
    syncFrequencyMinutes: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // Load settings
  useEffect(() => {
    if (!user?.id) return;

    const loadSettings = async () => {
      try {
        const therapistSettings = await getTherapistSettings(user.id);
        if (therapistSettings) {
          setSettings(therapistSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user?.id]);

  const handleSaveSettings = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await updateTherapistSettings(user.id, settings);
      // Show success message
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCalendlyConnect = () => {
    // This would redirect to Calendly OAuth
    // For now, just show a placeholder
    alert('Calendly OAuth integration would go here');
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
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <p className="text-gray-600">Configure your Calendly integration and preferences</p>
          </div>

          {/* Calendly Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Calendly Integration
              </CardTitle>
              <CardDescription>
                Connect your Calendly account to automatically sync appointments to your portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Connection Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${settings.calendlyToken ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {settings.calendlyToken ? 'Connected to Calendly' : 'Not Connected'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {settings.calendlyToken 
                        ? 'Your appointments will sync automatically' 
                        : 'Connect your account to enable automatic syncing'}
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleCalendlyConnect} 
                  variant="outline"
                  className="text-gray-900 border-gray-300 hover:bg-gray-50 font-medium"
                >
                  {settings.calendlyToken ? 'Reconnect' : 'Connect Account'}
                </Button>
              </div>

              {/* Sync Settings - Only show if connected */}
              {settings.calendlyToken && (
                <>
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Sync Settings</h4>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <Label htmlFor="syncEnabled" className="text-sm font-medium text-gray-900">
                          Automatic Sync
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">
                          Automatically sync appointments from Calendly
                        </p>
                      </div>
                      <Switch
                        id="syncEnabled"
                        checked={settings.syncEnabled}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, syncEnabled: checked }))
                        }
                      />
                    </div>

                    {settings.syncEnabled && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Label htmlFor="syncFrequency" className="text-sm font-medium text-gray-900">
                          Sync Frequency
                        </Label>
                        <p className="text-sm text-gray-500 mb-3">
                          How often should we check for new appointments?
                        </p>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="syncFrequency"
                            type="number"
                            value={settings.syncFrequencyMinutes}
                            onChange={(e) =>
                              setSettings(prev => ({
                                ...prev,
                                syncFrequencyMinutes: parseInt(e.target.value) || 10
                              }))
                            }
                            className="w-24"
                            min="5"
                            max="60"
                          />
                          <span className="text-sm text-gray-600">minutes</span>
                        </div>
                      </div>
                    )}

                    {settings.lastSync && (
                      <div className="text-xs text-gray-500 pt-2">
                        Last synced: {settings.lastSync.toDate().toLocaleString()}
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Service Type Mappings - Only show if connected */}
          {settings.calendlyToken && (
            <Card>
              <CardHeader>
                <CardTitle>Service Type Mappings</CardTitle>
                <CardDescription>
                  Map your Calendly event types to internal service categories for better organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(settings.eventTypeMappings || {}).length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">No event type mappings configured</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newMappings = { ...settings.eventTypeMappings };
                          const newId = `event_${Date.now()}`;
                          newMappings[newId] = '';
                          setSettings(prev => ({ ...prev, eventTypeMappings: newMappings }));
                        }}
                      >
                        Add Your First Mapping
                      </Button>
                    </div>
                  ) : (
                    <>
                      {Object.entries(settings.eventTypeMappings).map(([calendlyId, serviceType]) => (
                        <div key={calendlyId} className="flex items-end space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-gray-900">Calendly Event Type</Label>
                            <Input 
                              value={calendlyId} 
                              readOnly 
                              className="mt-1 bg-white" 
                              placeholder="Event type ID from Calendly"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-gray-900">Internal Service Name</Label>
                            <Input
                              value={serviceType}
                              onChange={(e) => {
                                const newMappings = { ...settings.eventTypeMappings };
                                newMappings[calendlyId] = e.target.value;
                                setSettings(prev => ({ ...prev, eventTypeMappings: newMappings }));
                              }}
                              className="mt-1"
                              placeholder="e.g., Individual Therapy, Couples Session"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newMappings = { ...settings.eventTypeMappings };
                              delete newMappings[calendlyId];
                              setSettings(prev => ({ ...prev, eventTypeMappings: newMappings }));
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        onClick={() => {
                          const newMappings = { ...settings.eventTypeMappings };
                          const newId = `event_${Date.now()}`;
                          newMappings[newId] = '';
                          setSettings(prev => ({ ...prev, eventTypeMappings: newMappings }));
                        }}
                        className="w-full"
                      >
                        + Add Another Mapping
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSettings} 
              disabled={saving}
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}