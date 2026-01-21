'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, checkIsLoggedIn } from '../../../lib/auth-helpers';
import { firestore } from '../../../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { useTheme } from '../../../components/theme-provider';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TherapistSetupPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialization: '',
    bio: '',
  });

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

    setUser(currentUser);
    setFormData(prev => ({
      ...prev,
      name: currentUser.name || ''
    }));
    setLoading(false);
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setError(null);
    setSubmitting(true);

    try {
      // Create user document with therapist role
      const userDoc = {
        uid: user.id,
        email: user.email,
        role: 'therapist',
        name: formData.name || user.name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(firestore, 'users', user.id), userDoc, { merge: true });

      // Create therapist profile document
      const therapistDoc = {
        uid: user.id,
        email: user.email,
        name: formData.name || user.name,
        phone: formData.phone,
        specialization: formData.specialization,
        bio: formData.bio,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(firestore, 'therapists', user.id), therapistDoc);

      setSuccess(true);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/therapist/dashboard');
      }, 2000);
    } catch (err) {
      const message = (err as any)?.message || 'Failed to complete setup. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {success ? (
          <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900">
            <CardContent className="pt-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">Setup Complete!</h2>
                <p className="text-emerald-800 dark:text-emerald-200">
                  Your therapist profile has been created successfully.
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Redirecting to your dashboard...
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Therapist Profile</CardTitle>
              <CardDescription>
                Set up your therapist account to start managing your appointments and clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg flex gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800 dark:text-red-200">{error}</div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-base font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Dr. Jane Smith"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-10"
                  />
                </motion.div>

                {/* Phone */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-2"
                >
                  <Label htmlFor="phone" className="text-base font-medium">
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-10"
                  />
                </motion.div>

                {/* Specialization */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="specialization" className="text-base font-medium">
                    Specialization (Optional)
                  </Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    type="text"
                    placeholder="e.g., Cognitive Behavioral Therapy, Anxiety"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="h-10"
                  />
                </motion.div>

                {/* Bio */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-2"
                >
                  <Label htmlFor="bio" className="text-base font-medium">
                    Bio / About You (Optional)
                  </Label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell clients about your approach and experience..."
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </motion.div>

                {/* Important Note */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg"
                >
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Important</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Make sure your Calendly account email matches <strong>{user?.email}</strong>. The system will sync your Calendly appointments every 10 minutes.
                  </p>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex gap-3 pt-4"
                >
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-11"
                  >
                    {submitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Completing Setup...
                      </>
                    ) : (
                      'Complete Setup'
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 bg-card border border-border rounded-lg"
        >
          <h3 className="font-semibold mb-3 text-foreground">What's Next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>Connect your Calendly account (email must match)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>Appointments will appear in your dashboard automatically</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>Start managing clients and tracking sessions</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
