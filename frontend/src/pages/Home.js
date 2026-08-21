// ============================================================
// pages/Home.js - Landing page
// ============================================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../context/api';
import TourCard from '../components/tours/TourCard';

function Home() {
  const [featuredTours, setFeaturedTours] = useState([]);

  useEffect(() => {
    // Fetch first 3 tours to show as featured
    API.get('/tours').then((res) => setFeaturedTours(res.data.slice(0, 3)));
  }, []);

  return (
    <div>
      {/* ── Hero Section ─────────────────────────────────────── */}
      <div
        className="text-white text-center py-5"
        style={{
          background: 'linear-gradient(135deg, #0d6efd 0%, #0056b3 100%)',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container">
          <i className="bi bi-airplane display-1 mb-3"></i>
          <h1 className="display-4 fw-bold">Explore the World with TourGo</h1>
          <p className="lead mb-4">
            Discover amazing destinations, book tours, and create unforgettable memories.
          </p>
          <Link to="/tours" className="btn btn-light btn-lg me-3">
            <i className="bi bi-search me-2"></i>Browse Tours
          </Link>
          <Link to="/register" className="btn btn-outline-light btn-lg">
            <i className="bi bi-person-plus me-2"></i>Get Started
          </Link>
        </div>
      </div>

      {/* ── Stats Section ─────────────────────────────────────── */}
      <div className="bg-white py-4 shadow-sm">
        <div className="container">
          <div className="row text-center">
            {[
              { icon: 'bi-map', value: '50+', label: 'Destinations' },
              { icon: 'bi-people', value: '1000+', label: 'Happy Travelers' },
              { icon: 'bi-star', value: '4.8', label: 'Average Rating' },
              { icon: 'bi-shield-check', value: '100%', label: 'Safe Travels' },
            ].map((stat, i) => (
              <div key={i} className="col-6 col-md-3 py-3">
                <i className={`bi ${stat.icon} text-primary display-6`}></i>
                <h3 className="fw-bold mt-2">{stat.value}</h3>
                <p className="text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured Tours ────────────────────────────────────── */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            <i className="bi bi-stars text-warning me-2"></i>Featured Tours
          </h2>
          <Link to="/tours" className="btn btn-primary">View All Tours</Link>
        </div>

        {featuredTours.length === 0 ? (
          <div className="text-center text-muted py-4">
            <i className="bi bi-hourglass-split display-4"></i>
            <p className="mt-2">Loading tours...</p>
          </div>
        ) : (
          <div className="row g-4">
            {featuredTours.map((tour) => (
              <div key={tour._id} className="col-md-4">
                <TourCard tour={tour} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── How It Works ─────────────────────────────────────── */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">How It Works</h2>
          <div className="row g-4 text-center">
            {[
              { step: '1', icon: 'bi-search', title: 'Browse Tours', desc: 'Explore our wide range of tour packages.' },
              { step: '2', icon: 'bi-calendar-check', title: 'Book Your Tour', desc: 'Select date, travelers, and confirm your booking.' },
              { step: '3', icon: 'bi-bag-check', title: 'Enjoy the Journey', desc: 'Travel, explore, and make memories.' },
              { step: '4', icon: 'bi-chat-heart', title: 'Share Feedback', desc: 'Rate your experience and help others.' },
            ].map((item) => (
              <div key={item.step} className="col-6 col-md-3">
                <div className="bg-white rounded-3 p-4 shadow-sm h-100">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 50, height: 50, fontSize: 20 }}>
                    {item.step}
                  </div>
                  <i className={`bi ${item.icon} display-6 text-primary d-block mb-2`}></i>
                  <h5 className="fw-bold">{item.title}</h5>
                  <p className="text-muted small">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-dark text-white text-center py-4 mt-auto">
        <p className="mb-0">
          © 2024 TourGo — Tourism Management System | Built with MERN Stack
        </p>
      </footer>
    </div>
  );
}

export default Home;
