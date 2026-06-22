// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LoginPage              from './pages/LoginPage';
import DashboardPage          from './pages/DashboardPage';
import ResultEntryPage        from './pages/ResultEntryPage';
import ResultRecordsPage      from './pages/ResultRecordsPage';
import AnalyticsPage          from './pages/AnalyticsPage';
import StudentPerformancePage from './pages/StudentPerformancePage';
import StudentDashboardPage   from './pages/StudentDashboardPage';
import SettingsPage           from './pages/SettingsPage';

function DashboardLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, user } = useAuth();
  const homePath = user?.role === 'student' ? '/student-dashboard' : '/dashboard';

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={homePath} replace /> : <LoginPage />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="teacher">
            <DashboardLayout><DashboardPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/result-entry"
        element={
          <ProtectedRoute role="teacher">
            <DashboardLayout><ResultEntryPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/result-records"
        element={
          <ProtectedRoute role="teacher">
            <DashboardLayout><ResultRecordsPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute role="teacher">
            <DashboardLayout><AnalyticsPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-performance"
        element={
          <ProtectedRoute role="teacher">
            <DashboardLayout><StudentPerformancePage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute role="teacher">
            <DashboardLayout><SettingsPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to={isAuthenticated ? homePath : '/login'} replace />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? homePath : '/login'} replace />} />
    </Routes>
  );
}
