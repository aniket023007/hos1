import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export function ProtectedRoute({ allow }: { allow: Role }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to={allow === 'student' ? '/student/login' : '/warden/login'} replace />;
  }

  if (user.role !== allow) {
    // A student trying a warden route (or vice versa) is denied and redirected to their own dashboard.
    return <Navigate to={user.role === 'student' ? '/student/dashboard' : '/warden/dashboard'} replace />;
  }

  return <Outlet />;
}
