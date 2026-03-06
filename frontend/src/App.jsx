import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/Home';
import LoginPage from './pages/LoginPage';
import QueryFormPage from './pages/QueryFormPage';
import AppointmentPage from './pages/AppointmentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import VideoCallPage from './pages/VideoCallPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child components (the dashboard/app pages)
  return children;
};

// Global Layout Wrapper
const AppLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {user && <Navbar />} {/* Only show Navbar if logged in */}
      <main className="flex-grow">
        {children}
      </main>
      {user && <Footer />} {/* Only show Footer if logged in */}
    </div>
  );
};

function AppRoutes() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/query"
            element={
              <ProtectedRoute>
                <QueryFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointment"
            element={
              <ProtectedRoute>
                <AppointmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirmation"
            element={
              <ProtectedRoute>
                <ConfirmationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/video-call"
            element={
              <ProtectedRoute>
                <VideoCallPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
      <Toaster position="top-right" />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
