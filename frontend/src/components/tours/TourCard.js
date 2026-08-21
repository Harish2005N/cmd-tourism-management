// ============================================================
 // components/tours/TourCard.js - Multiple images carousel
 // ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function TourCard({ tour }) {
  const { user } = useAuth();
  
  // Get first image or fallback
  const getMainImage = () => {
    if (tour.images && tour.images.length > 0) {
      return tour.images[0];
    }
    if (tour.image) {
      return tour.image; // Backward compat
    }
    return 'https://placehold.co/400x250?text=Tour';
  };

  // Simple carousel effect for multiple images
  const renderImages = () => {
    const images = tour.images && tour.images.length > 0 ? tour.images : (tour.image ? [tour.image] : []);
    if (images.length === 0) {
      return (
        <img
          src="https://placehold.co/400x250?text=Tour"
          className="card-img-top tour-card-img"
          alt={tour.name}
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x250?text=Tour';
          }}
        />
      );
    }

    if (images.length === 1) {
      return (
        <img
          src={images[0]}
          className="card-img-top tour-card-img"
          alt={tour.name}
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x250?text=Tour';
          }}
        />
      );
    }

    // Carousel for 2+ images
    return (
      <div id={`carousel-${tour._id}`} className="carousel slide card-img-top" data-bs-ride="carousel" style={{height: '250px'}}>
        <div className="carousel-inner h-100">
          {images.map((imgUrl, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''} h-100`}>
              <img 
                src={imgUrl} 
                className="d-block w-100 h-100 tour-card-img" 
                alt={`${tour.name} - Image ${index + 1}`}
                style={{objectFit: 'cover'}}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x250?text=Tour';
                }}
              />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${tour._id}`} data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${tour._id}`} data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
        {images.length > 1 && (
          <div className="carousel-indicators position-absolute bottom-0 start-0 end-0 mb-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target={`#carousel-${tour._id}`}
                data-bs-slide-to={index}
                className={`mx-1 ${index === 0 ? 'active' : ''}`}
                aria-label={`Slide ${index + 1}`}
                style={{width: '8px', height: '8px'}}
              ></button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card h-100 shadow-sm border-0">
      {/* Tour Images Carousel */}
      {renderImages()}

      <div className="card-body d-flex flex-column">
        {/* Tour Name & Destination */}
        <h5 className="card-title fw-bold">{tour.name}</h5>
        <p className="text-muted mb-1">
          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
          {tour.destination}
        </p>

        {/* Tour Description (truncated) */}
        <p className="card-text text-secondary small flex-grow-1">
          {tour.description.length > 100
            ? tour.description.substring(0, 100) + '...'
            : tour.description}
        </p>

        {/* Info Badges */}
        <div className="d-flex gap-2 flex-wrap mb-3">
          <span className="badge bg-primary">
            <i className="bi bi-clock me-1"></i>{tour.duration} Days
          </span>
          <span className={`badge ${tour.availableSeats > 0 ? 'bg-success' : 'bg-danger'}`}>
            <i className="bi bi-people me-1"></i>
            {tour.availableSeats > 0 ? `${tour.availableSeats} Seats` : 'Sold Out'}
          </span>
          {tour.itinerary && tour.itinerary.length > 0 && (
            <span className="badge bg-info text-dark" title={tour.itinerary.map(d => `Day ${d.day}: ${d.location}`).join('; ')}>
              <i className="bi bi-map me-1"></i>
              Plan
            </span>
          )}
          {tour.itinerary && tour.itinerary[0] && (
            <small className="text-muted fst-italic">
              Day 1: {tour.itinerary[0].location}
            </small>
          )}
        </div>

        {/* Price */}
        <div className="d-flex justify-content-between align-items-center">
          <span className="h5 text-primary fw-bold mb-0">
            ₹{tour.price.toLocaleString()}
            <small className="text-muted fs-6 fw-normal"> /person</small>
          </span>
        </div>
      </div>

      {/* Card Footer Buttons */}
      <div className="card-footer bg-white border-0 d-flex gap-2 pb-3">
        <Link to={`/tours/${tour._id}`} className="btn btn-outline-primary btn-sm flex-grow-1">
          View Details
        </Link>
        {user && user.role === 'user' && tour.availableSeats > 0 && (
          <Link to={`/book/${tour._id}`} className="btn btn-primary btn-sm flex-grow-1">
            Book Now
          </Link>
        )}
        {!user && (
          <Link to="/login" className="btn btn-primary btn-sm flex-grow-1">
            Login to Book
          </Link>
        )}
      </div>
    </div>
  );
}

export default TourCard;
