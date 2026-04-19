import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar, Topbar } from './components/Layout';
import { Loading } from './components/index';

// Pages
import { LoginPage, RegisterPage } from './pages/Auth';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentHostelsPage, StudentRoomsPage } from './pages/StudentPages';
import { AdminDashboard, AdminStudentsPage, AdminHostelsPage } from './pages/AdminPages';
import { AdminRoomsPage, AdminAllocationsPage } from './pages/AdminRoomsAllocations';

// Import Styles
import './styles/theme.css';
import './styles/components.css';
import './styles/layout.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userType, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userType !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout Component for Dashboard Pages
const DashboardLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-container">
      <Sidebar collapsed={!sidebarOpen} />
      <div className="main-content">
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={title} />
        <div className="content-area animate-in">
          {children}
        </div>
      </div>
    </div>
  );
};

// Main App Component
function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout title="Dashboard">
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/hostels"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout title="Available Hostels">
              <StudentHostelsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/rooms"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout title="Available Rooms">
              <StudentRoomsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/applications"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout title="My Applications">
              <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', marginBottom: '16px' }}>
                  My Applications
                </h2>
                <p style={{ color: 'var(--color-medium-gray)' }}>
                  Your room applications will appear here
                </p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout title="Admin Dashboard">
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout title="Manage Students">
              <AdminStudentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hostels"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout title="Manage Hostels">
              <AdminHostelsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout title="Manage Rooms">
              <AdminRoomsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/allocations"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout title="Manage Allocations">
              <AdminAllocationsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
