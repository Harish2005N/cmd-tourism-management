// ============================================================
 // pages/TourDetailPage.js - Single tour with gallery carousel
 // ============================================================

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../context/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating';

function TourDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tour, setTour]           = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    // Fetch tour and feedback in parallel
    Promise.all([
      API.get(`/tours/${id}`),
      API.get(`/feedback/tour/${id}`),
    ]).then(([tourRes, feedbackRes]) => {
      setTour(tourRes.data);
      setFeedbacks(feedbackRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  // Calculate average rating
  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : null;

  // Get images array for carousel (backward compat)
  const getImages = () => {
    if (tour.images && tour.images.length > 0) {
      return tour.images;
    }
    if (tour.image) {
      return [tour.image];
    }
    return ['https://placehold.co/800x400?text=Tour'];
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" style={{ width: 50, height: 50 }}></div>
    </div>
  );

  if (!tour) return (
    <div className="container py-5 text-center">
      <h3>Tour not found</h3>
      <Link to="/tours" className="btn btn-primary">Back to Tours</Link>
    </div>
  );

  const images = getImages();

  return (
    <div className="container py-5">
      <Link to="/tours" className="btn btn-outline-secondary mb-4">
        <i className="bi bi-arrow-left me-2"></i>Back to Tours
      </Link>

      <div className="row g-4">
        {/* Left: Gallery Carousel & Details */}
        <div className="col-lg-7">
          {/* Images Carousel */}
          <div id={`tour-gallery-${tour._id}`} className="carousel slide shadow mb-4" data-bs-ride="carousel">
            <div className="carousel-inner">
              {images.map((imgUrl, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <img
                    src={imgUrl}
                    className="d-block w-100 rounded-3"
                    alt={`${tour.name} - Image ${index + 1}`}
                    style={{ height: 350, objectFit: 'cover' }}
                    onError={(e) => { 
                      e.target.src = 'https://placehold.co/800x400?text=Tour'; 
                    }}
                  />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target={`#tour-gallery-${tour._id}`} data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target={`#tour-gallery-${tour._id}`} data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
                <div className="carousel-indicators">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      data-bs-target={`#tour-gallery-${tour._id}`}
                      data-bs-slide-to={index}
                      className={index === 0 ? 'active' : ''}
                      aria-label={`Slide ${index + 1}`}
                    ></button>
                  ))}
                </div>
              </>
            )}
          </div>

          <h2 className="fw-bold">{tour.name}</h2>
          <p className="text-muted fs-5">
            <i className="bi bi-geo-alt-fill text-danger me-2"></i>{tour.destination}
          </p>
          <p className="text-secondary">{tour.description}</p>

          {/* Travel Itinerary Section */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <div className="mt-5 mb-5">
              <h4 className="fw-bold mb-4">
                <i className="bi bi-map me-2 text-primary"></i>Travel Itinerary
              </h4>
              <div className="itinerary-timeline ms-2">
                {tour.itinerary.sort((a, b) => a.day - b.day).map((item, index) => (
                  <div key={index} className="d-flex mb-4 position-relative">
                    <div className="me-3 text-center" style={{ minWidth: '60px' }}>
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1" style={{ width: '40px', height: '40px' }}>
                        {item.day}
                      </div>
                      <small className="text-muted fw-bold">DAY</small>
                    </div>
                    <div className="flex-grow-1 pb-3 border-start ps-4 position-relative" style={{ borderColor: '#dee2e6 !important' }}>
                      {/* Timeline line connector */}
                      {index < tour.itinerary.length - 1 && (
                        <div className="position-absolute" style={{ left: '-1px', top: '40px', bottom: '-24px', width: '2px', backgroundColor: '#dee2e6' }}></div>
                      )}
                      <h5 className="fw-bold text-dark">{item.location}</h5>
                      <p className="text-secondary mb-0">{item.activities}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating Summary */}
          {avgRating && (
            <div className="alert alert-warning d-inline-flex align-items-center gap-2">
              <StarRating rating={Math.round(avgRating)} />
              <strong>{avgRating}</strong>
              <span className="text-muted">({feedbacks.length} reviews)</span>
            </div>
          )}
        </div>

        {/* Right: Booking Card */}
        <div className="col-lg-5">
          <div className="card shadow border-0 sticky-top" style={{ top: 80 }}>
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0"><i className="bi bi-info-circle me-2"></i>Tour Info</h5>
            </div>
            <div className="card-body">
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted"><i className="bi bi-cash me-2"></i>Price</td>
                    <td className="fw-bold text-primary fs-5">₹{tour.price.toLocaleString()} /person</td>
                  </tr>
                  <tr>
                    <td className="text-muted"><i className="bi bi-clock me-2"></i>Duration</td>
                    <td className="fw-semibold">{tour.duration} Days</td>
                  </tr>
                  <tr>
                    <td className="text-muted"><i className="bi bi-people me-2"></i>Seats</td>
                    <td>
                      <span className={`badge ${tour.availableSeats > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {tour.availableSeats > 0 ? `${tour.availableSeats} available` : 'Sold Out'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="d-grid gap-2 mt-3">
                {user && user.role === 'user' && tour.availableSeats > 0 ? (
                  <>
                    <Link to={`/book/${tour._id}`} className="btn btn-primary btn-lg">
                      <i className="bi bi-calendar-plus me-2"></i>Book This Tour
                    </Link>
                    <Link to={`/feedback/${tour._id}`} className="btn btn-outline-warning">
                      <i className="bi bi-star me-2"></i>Write a Review
                    </Link>
                  </>
                ) : !user ? (
                  <Link to="/login" className="btn btn-primary btn-lg">
                    <i className="bi bi-person me-2"></i>Login to Book
                  </Link>
                ) : (
                  <button className="btn btn-secondary" disabled>Sold Out</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="mt-5">
        <h4 className="fw-bold mb-3">
          <i className="bi bi-chat-square-text me-2 text-warning"></i>
          Customer Reviews ({feedbacks.length})
        </h4>
        {feedbacks.length === 0 ? (
          <p className="text-muted">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="row g-3">
            {feedbacks.map((f) => (
              <div key={f._id} className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <strong>{f.user?.name || 'User'}</strong>
                      <StarRating rating={f.rating} />
                    </div>
                    <p className="text-secondary mb-0">{f.comment}</p>
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

export default TourDetailPage;

