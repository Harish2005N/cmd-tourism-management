// ============================================================
// pages/AdminBookings.js - View all customer bookings
// ============================================================

import React, { useEffect, useState } from 'react';
import API from '../context/api';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all'); // all | confirmed | cancelled

  useEffect(() => {
    API.get('/bookings')
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter);

  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const handleConfirm = async (id) => {
    if (!window.confirm('Are you sure you want to confirm this booking?')) return;
    try {
      await API.put(`/bookings/${id}/confirm`);
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'confirmed' } : b));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to confirm booking');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This will restore the tour seats.')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 className="fw-bold"><i className="bi bi-calendar-check me-2"></i>All Bookings</h1>
          <p className="lead">Total Revenue: <strong>₹{totalRevenue.toLocaleString()}</strong></p>
        </div>
      </div>

      <div className="container pb-5">
        {/* Filter Buttons */}
        <div className="btn-group mb-4">
          {['all', 'pending', 'confirmed', 'cancelled'].map((f) => (
            <button
              key={f}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th><th>Customer</th><th>Email</th><th>Tour</th>
                    <th>Travel Date</th><th>Travelers</th><th>Total</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="8" className="text-center text-muted py-4">No bookings found</td></tr>
                  ) : filtered.map((b, i) => (
                    <tr key={b._id}>
                      <td>{i + 1}</td>
                      <td className="fw-semibold">{b.user?.name}</td>
                      <td><small>{b.user?.email}</small></td>
                      <td>{b.tour?.name}</td>
                      <td>{new Date(b.travelDate).toLocaleDateString()}</td>
                      <td>{b.travelers}</td>
                      <td className="fw-semibold text-primary">₹{b.totalPrice?.toLocaleString()}</td>
                      <td>
                        <span className={`badge bg-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : b.status === 'pending' ? 'warning text-dark' : 'secondary'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        {b.status === 'pending' && (
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm btn-success" 
                              onClick={() => handleConfirm(b._id)}
                              title="Confirm Booking"
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => handleCancel(b._id)}
                              title="Cancel Booking"
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                        )}
                        {b.status === 'confirmed' && (
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => handleCancel(b._id)}
                            title="Cancel Booking"
                          >
                            <i className="bi bi-x-lg"></i> Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer text-muted small">
              Showing {filtered.length} of {bookings.length} bookings
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBookings;
