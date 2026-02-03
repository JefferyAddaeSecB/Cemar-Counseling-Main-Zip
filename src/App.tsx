import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/navbar';
import Footer from './components/footer';
import HomePage from './pages/home-page';
import AboutPage from './pages/about/page';
import ServicesPage from './pages/services/page';
import ContactPage from './pages/contact/page';
import FAQPage from './pages/faq/page';
import BookingPage from './pages/booking/page';
import LoginPage from './pages/login/page';
import TermsPage from './pages/terms/page';
import ForgotPasswordPage from './pages/forgot-password/page';
import ProfilePage from './pages/profile/page';
import AccountSettingsPage from './pages/account-settings/page';
import PreferencesPage from './pages/settings/page';
import PrivacyPolicyPage from './pages/privacy/page';
import InformedConsentPage from './pages/informed-consent/page';
import ProtectedRoute from './components/protected-route';
import ProtectedTherapistRoute from './components/therapist/protected-route';
import TherapistSchedulePage from './pages/therapist/schedule/page';
import TherapistClientsPage from './pages/therapist/clients/page';
import TherapistSettingsPage from './pages/therapist/settings/page';
import TherapistSetupPage from './pages/therapist/setup/page';
import ClientProfilePage from './pages/therapist/clients/[clientId]/page';
import './styles/globals.css';

function App() {
  const location = useLocation();
  const isTherapistRoute = location.pathname.startsWith('/therapist');

  return (
    <ThemeProvider defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen flex-col">
        {!isTherapistRoute && <Navbar />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/informed-consent" element={<InformedConsentPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account-settings"
              element={
                <ProtectedRoute>
                  <AccountSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preferences"
              element={
                <ProtectedRoute>
                  <PreferencesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/therapist/schedule"
              element={
                <ProtectedTherapistRoute requiredRole="therapist">
                  <TherapistSchedulePage />
                </ProtectedTherapistRoute>
              }
            />
            <Route
              path="/therapist/dashboard"
              element={
                <ProtectedTherapistRoute requiredRole="therapist">
                  <TherapistSchedulePage />
                </ProtectedTherapistRoute>
              }
            />
            <Route
              path="/therapist/clients"
              element={
                <ProtectedTherapistRoute requiredRole="therapist">
                  <TherapistClientsPage />
                </ProtectedTherapistRoute>
              }
            />
            <Route
              path="/therapist/settings"
              element={
                <ProtectedTherapistRoute requiredRole="therapist">
                  <TherapistSettingsPage />
                </ProtectedTherapistRoute>
              }
            />
            <Route
              path="/therapist/setup"
              element={<TherapistSetupPage />}
            />
            <Route
              path="/therapist/clients/:clientId"
              element={
                <ProtectedTherapistRoute requiredRole="therapist">
                  <ClientProfilePage />
                </ProtectedTherapistRoute>
              }
            />
          </Routes>
        </main>
        {!isTherapistRoute && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App; 