// ============================================================
// App.js - Root component with all routes defined
// ============================================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/common/Navbar';

// Public pages
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// User pages
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import FeedbackPage from './pages/FeedbackPage';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminTours from './pages/AdminTours';
import AdminBookings from './pages/AdminBookings';
import AdminFeedback from './pages/AdminFeedback';

// ── PrivateRoute: redirects to /login if not authenticated ──
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// ── AdminRoute: redirects if not admin ──────────────────────
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route path="/tours"     element={<ToursPage />} />
        <Route path="/tours/:id" element={<TourDetailPage />} />

        {/* User Protected Routes */}
        <Route path="/book/:id"     element={<PrivateRoute><BookingPage /></PrivateRoute>} />
        <Route path="/my-bookings"  element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />
        <Route path="/feedback/:id" element={<PrivateRoute><FeedbackPage /></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path="/admin"           element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/tours"     element={<AdminRoute><AdminTours /></AdminRoute>} />
        <Route path="/admin/bookings"  element={<AdminRoute><AdminBookings /></AdminRoute>} />
        <Route path="/admin/feedback"  element={<AdminRoute><AdminFeedback /></AdminRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
