// ============================================================
// pages/MyBookingsPage.js - User's booking history
// ============================================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../context/api';

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchBookings = () => {
    API.get('/bookings/my')
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${bookingId}/cancel`);
      fetchBookings(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed');
    }
  };

  // Color-coded status badges
  const statusBadge = (status) => {
    const map = {
      pending:    'bg-warning text-dark',
      confirmed:  'bg-success',
      cancelled:  'bg-danger',
      completed:  'bg-secondary',
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 className="fw-bold">
            <i className="bi bi-bag-heart me-2"></i>My Bookings
          </h1>
          <p className="lead">Track and manage all your tour reservations</p>
        </div>
      </div>

      <div className="container pb-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-calendar-x display-1 text-muted"></i>
            <h4 className="mt-3 text-muted">No bookings yet</h4>
            <Link to="/tours" className="btn btn-primary mt-2">Browse Tours</Link>
          </div>
        ) : (
          <div className="row g-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    {/* Status Badge */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold mb-0">{booking.tour?.name}</h5>
                      {statusBadge(booking.status)}
                    </div>

                    <p className="text-muted mb-2">
                      <i className="bi bi-geo-alt text-danger me-1"></i>
                      {booking.tour?.destination}
                    </p>

                    <div className="row text-sm g-2 mb-3">
                      <div className="col-6">
                        <small className="text-muted d-block">Travel Date</small>
                        <strong>{new Date(booking.travelDate).toLocaleDateString()}</strong>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Travelers</small>
                        <strong>{booking.travelers} person(s)</strong>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Duration</small>
                        <strong>{booking.tour?.duration} Days</strong>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Total Paid</small>
                        <strong className="text-primary">₹{booking.totalPrice?.toLocaleString()}</strong>
                      </div>
                    </div>

                    <small className="text-muted d-block mb-3">
                      Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                    </small>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2">
                      <Link
                        to={`/tours/${booking.tour?._id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        View Tour
                      </Link>
                      {booking.status === 'confirmed' && (
                        <Link
                          to={`/feedback/${booking.tour?._id}`}
                          className="btn btn-outline-warning btn-sm"
                        >
                          <i className="bi bi-star me-1"></i>Review
                        </Link>
                      )}
                      {(booking.status === 'confirmed' || booking.status === 'pending') && (
                        <button
                          className="btn btn-outline-danger btn-sm ms-auto"
                          onClick={() => handleCancel(booking._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookingsPage;
