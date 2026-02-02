'use client';

import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Users, Settings, LogOut, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export default function TherapistSidebarNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { path: '/therapist/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/therapist/clients', icon: Users, label: 'Clients' },
    { path: '/therapist/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <img 
          src="/images/logo.png" 
          alt="CEMAR Counseling" 
          className="h-16 w-auto"
        />
        <p className="text-sm text-gray-500 mt-2">Therapist Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                active
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${active ? 'text-teal-700' : 'text-gray-500'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:bg-gray-50"
          onClick={() => navigate('/')}
        >
          <Home className="w-5 h-5 mr-3 text-gray-500" />
          Public Site
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
