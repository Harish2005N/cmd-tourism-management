// ============================================================
// pages/AdminFeedback.js - View and manage all feedback
// ============================================================

import React, { useEffect, useState } from 'react';
import API from '../context/api';
import StarRating from '../components/common/StarRating';

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetchFeedback = () => {
    API.get('/feedback')
      .then((res) => setFeedbacks(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFeedback(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await API.delete(`/feedback/${id}`);
      fetchFeedback();
    } catch (err) {
      alert('Delete failed');
    }
  };

  // Calculate overall average rating
  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 className="fw-bold"><i className="bi bi-chat-square-text me-2"></i>Customer Feedback</h1>
          <p className="lead">
            Average Rating: <strong>{avgRating}/5</strong> from {feedbacks.length} reviews
          </p>
        </div>
      </div>

      <div className="container pb-5">
        {loading ? (
          <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-chat display-1"></i>
            <h4 className="mt-3">No feedback yet</h4>
          </div>
        ) : (
          <div className="row g-3">
            {feedbacks.map((f) => (
              <div key={f._id} className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold mb-0">{f.user?.name}</h6>
                        <small className="text-muted">{f.user?.email}</small>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(f._id)}
                        title="Delete feedback"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>

                    {/* Tour name */}
                    <p className="text-primary small mb-2">
                      <i className="bi bi-map me-1"></i>{f.tour?.name} — {f.tour?.destination}
                    </p>

                    {/* Stars */}
                    <StarRating rating={f.rating} />

                    {/* Comment */}
                    <p className="text-secondary mt-2 mb-1">{f.comment}</p>

                    <small className="text-muted">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </small>
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

export default AdminFeedback;
