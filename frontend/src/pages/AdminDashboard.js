// ============================================================
// pages/AdminDashboard.js - Admin overview with stats
// ============================================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../context/api';

function AdminDashboard() {
  const [stats, setStats] = useState({ tours: 0, bookings: 0, feedback: 0, revenue: 0 });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    // Fetch all data for the dashboard
    Promise.all([
      API.get('/tours/all'),
      API.get('/bookings'),
      API.get('/feedback'),
    ]).then(([toursRes, bookingsRes, feedbackRes]) => {
      const bookings = bookingsRes.data;
      const revenue = bookings
        .filter((b) => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

      setStats({
        tours: toursRes.data.length,
        bookings: bookings.length,
        feedback: feedbackRes.data.length,
        revenue,
      });
      setRecentBookings(bookings.slice(0, 5)); // Show last 5 bookings
    });
  }, []);

  const statCards = [
    { title: 'Total Tours',    value: stats.tours,    icon: 'bi-map',           color: 'primary' },
    { title: 'Total Bookings', value: stats.bookings, icon: 'bi-calendar-check', color: 'success' },
    { title: 'Total Feedback', value: stats.feedback, icon: 'bi-chat-dots',     color: 'warning' },
    { title: 'Revenue (₹)',    value: `₹${stats.revenue.toLocaleString()}`, icon: 'bi-currency-rupee', color: 'info' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 className="fw-bold"><i className="bi bi-speedometer2 me-2"></i>Admin Dashboard</h1>
          <p className="lead">Manage your tourism platform</p>
        </div>
      </div>

      <div className="container pb-5">
        {/* Stats Cards */}
        <div className="row g-4 mb-5">
          {statCards.map((card, i) => (
            <div key={i} className="col-6 col-md-3">
              <div className={`card border-0 shadow-sm border-start border-4 border-${card.color}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted small mb-1">{card.title}</p>
                      <h3 className="fw-bold mb-0">{card.value}</h3>
                    </div>
                    <i className={`bi ${card.icon} display-5 text-${card.color} opacity-50`}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="row g-3 mb-5">
          {[
            { to: '/admin/tours',    icon: 'bi-plus-circle', label: 'Manage Tours',    color: 'primary' },
            { to: '/admin/bookings', icon: 'bi-list-check',  label: 'View Bookings',   color: 'success' },
            { to: '/admin/feedback', icon: 'bi-chat-square-text', label: 'View Feedback', color: 'warning' },
          ].map((link) => (
            <div key={link.to} className="col-md-4">
              <Link
                to={link.to}
                className={`card border-0 shadow-sm text-decoration-none text-${link.color} h-100`}
              >
                <div className="card-body text-center py-4">
                  <i className={`bi ${link.icon} display-4`}></i>
                  <h5 className="mt-2 fw-bold">{link.label}</h5>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Recent Bookings Table */}
        <h4 className="fw-bold mb-3">
          <i className="bi bi-clock-history me-2"></i>Recent Bookings
        </h4>
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Customer</th>
                  <th>Tour</th>
                  <th>Date</th>
                  <th>Travelers</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr><td colSpan="6" className="text-center text-muted py-4">No bookings yet</td></tr>
                ) : (
                  recentBookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.user?.name}</td>
                      <td>{b.tour?.name}</td>
                      <td>{new Date(b.travelDate).toLocaleDateString()}</td>
                      <td>{b.travelers}</td>
                      <td>₹{b.totalPrice?.toLocaleString()}</td>
                      <td>
                        <span className={`badge bg-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'secondary'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
