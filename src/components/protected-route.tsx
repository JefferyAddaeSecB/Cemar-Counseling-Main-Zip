import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkIsLoggedIn } from '../lib/auth-helpers';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!checkIsLoggedIn()) {
      // Save the current path as returnUrl
      navigate(`/login?returnUrl=${encodeURIComponent(location.pathname)}`);
    }
  }, [navigate, location]);

  if (!checkIsLoggedIn()) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 