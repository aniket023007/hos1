import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StudentLayout } from './layouts/StudentLayout';
import { WardenLayout } from './layouts/WardenLayout';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentRoom } from './pages/student/StudentRoom';
import { WardenDashboard } from './pages/warden/WardenDashboard';
import { WardenStudents } from './pages/warden/WardenStudents';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/student/login" element={<LoginPage role="student" />} />
      <Route path="/warden/login" element={<LoginPage role="warden" />} />

      <Route element={<ProtectedRoute allow="student" />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/room" element={<StudentRoom />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allow="warden" />}>
        <Route element={<WardenLayout />}>
          <Route path="/warden/dashboard" element={<WardenDashboard />} />
          <Route path="/warden/students" element={<WardenStudents />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
