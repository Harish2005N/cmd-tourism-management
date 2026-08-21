// ============================================================
// pages/FeedbackPage.js - Submit feedback for a tour
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../context/api';

function FeedbackPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour]     = useState(null);
  const [form, setForm]     = useState({ rating: 5, comment: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/tours/${id}`).then((res) => setTour(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/feedback', { tourId: id, ...form, rating: Number(form.rating) });
      alert('Thank you for your review!');
      navigate(`/tours/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="fw-bold mb-4">
            <i className="bi bi-star text-warning me-2"></i>Write a Review
          </h2>

          {tour && (
            <div className="alert alert-light border mb-4">
              <strong>Tour:</strong> {tour.name} — {tour.destination}
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Star Rating Selector */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Your Rating</label>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="btn p-0 border-0"
                        style={{ fontSize: 32 }}
                        onClick={() => setForm({ ...form, rating: star })}
                      >
                        <i
                          className={`bi ${star <= form.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
                        ></i>
                      </button>
                    ))}
                    <span className="ms-2 align-self-center text-muted">
                      {form.rating}/5 stars
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Your Review</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Share your experience with this tour..."
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    required
                    minLength={10}
                  ></textarea>
                  <div className="form-text">Minimum 10 characters</div>
                </div>

                <button type="submit" className="btn btn-warning w-100 fw-semibold" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                  ) : (
                    <><i className="bi bi-send me-2"></i>Submit Review</>
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

export default FeedbackPage;
