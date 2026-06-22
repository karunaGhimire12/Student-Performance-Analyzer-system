// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'student' ? '/student-dashboard' : '/dashboard'} replace />;
  }
  return children;
}
