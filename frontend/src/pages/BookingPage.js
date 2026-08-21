// ============================================================
// pages/BookingPage.js - Book a tour
// ============================================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../context/api';

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tour, setTour]       = useState(null);
  const [form, setForm]       = useState({ travelers: 1, travelDate: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    API.get(`/tours/${id}`)
      .then((res) => setTour(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalPrice = tour ? tour.price * form.travelers : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await API.post('/bookings', {
        tourId: id,
        travelers: Number(form.travelers),
        travelDate: form.travelDate,
      });
      setSuccess('🎉 Booking placed! Pending admin confirmation. Redirecting...');
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary"></div>
    </div>
  );

  // Minimum date is tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <h2 className="fw-bold mb-4">
            <i className="bi bi-calendar-plus text-primary me-2"></i>Book Your Tour
          </h2>

          {/* Tour Summary Card */}
          {tour && (
            <div className="card border-0 bg-light mb-4">
              <div className="card-body d-flex gap-3 align-items-center">
                <img
                  src={tour.image || 'https://placehold.co/80x80?text=Tour'}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                  alt={tour.name}
                  onError={(e) => { 
                    if (e.target.src !== 'https://placehold.co/80x80?text=Tour') {
                      e.target.src = 'https://placehold.co/80x80?text=Tour'; 
                    }
                  }}
                />
                <div>
                  <h5 className="fw-bold mb-1">{tour.name}</h5>
                  <p className="text-muted mb-0">
                    <i className="bi bi-geo-alt text-danger me-1"></i>{tour.destination}
                    <span className="ms-3">
                      <i className="bi bi-clock me-1"></i>{tour.duration} Days
                    </span>
                  </p>
                  <strong className="text-primary">₹{tour.price.toLocaleString()} /person</strong>
                </div>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {success && <div className="alert alert-success">{success}</div>}
          {error   && <div className="alert alert-danger">{error}</div>}

          {/* Booking Form */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-people me-2"></i>Number of Travelers
                  </label>
                  <input
                    type="number"
                    name="travelers"
                    className="form-control form-control-lg"
                    min="1"
                    max={tour?.availableSeats || 1}
                    value={form.travelers}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text">
                    Max available: {tour?.availableSeats} seats
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-calendar-event me-2"></i>Travel Date
                  </label>
                  <input
                    type="date"
                    name="travelDate"
                    className="form-control form-control-lg"
                    min={minDate}
                    value={form.travelDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Price Breakdown */}
                <div className="bg-primary text-white rounded-3 p-3 mb-4">
                  <div className="d-flex justify-content-between">
                    <span>₹{tour?.price?.toLocaleString()} × {form.travelers} traveler(s)</span>
                    <strong>₹{totalPrice.toLocaleString()}</strong>
                  </div>
                  <hr className="border-light my-2" />
                  <div className="d-flex justify-content-between fs-5">
                    <strong>Total Amount</strong>
                    <strong>₹{totalPrice.toLocaleString()}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={submitting}
                >
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Confirming...</>
                  ) : (
                    <><i className="bi bi-check-circle me-2"></i>Confirm Booking</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
