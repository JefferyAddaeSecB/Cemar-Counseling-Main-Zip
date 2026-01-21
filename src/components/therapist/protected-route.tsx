import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIsLoggedIn, getCurrentUser } from '../../lib/auth-helpers';
import { firestore } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'therapist' | 'client';
}

export default function ProtectedRoute({ children, requiredRole = 'therapist' }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      // Check if logged in
      if (!checkIsLoggedIn()) {
        navigate('/login');
        return;
      }

      const currentUser = getCurrentUser();
      if (!currentUser?.id) {
        navigate('/login');
        return;
      }

      try {
        // Check user role in Firestore
        const userDoc = await getDoc(doc(firestore, 'users', currentUser.id));
        
        if (!userDoc.exists()) {
          // Create user doc with default role
          // For now, assume first-time users are clients
          console.log('User doc not found, redirecting to profile setup');
          navigate('/');
          return;
        }

        const userData = userDoc.data();
        const userRole = userData?.role;

        if (requiredRole && userRole !== requiredRole) {
          console.log(`User is ${userRole}, but ${requiredRole} role required`);
          navigate('/');
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error('Error checking authorization:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [navigate, requiredRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
