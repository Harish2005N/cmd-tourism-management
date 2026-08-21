// ============================================================
// pages/ToursPage.js - Browse all available tours
// ============================================================

import React, { useEffect, useState } from 'react';
import API from '../context/api';
import TourCard from '../components/tours/TourCard';

function ToursPage() {
  const [tours, setTours]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    API.get('/tours')
      .then((res) => setTours(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Filter tours based on search input
  const filtered = tours.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="container text-center">
          <h1 className="fw-bold"><i className="bi bi-compass me-2"></i>All Tour Packages</h1>
          <p className="lead">Find your perfect travel adventure</p>
        </div>
      </div>

      <div className="container pb-5">
        {/* Search Bar */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white">
                <i className="bi bi-search text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by tour name or destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-muted mb-3">
            Showing <strong>{filtered.length}</strong> of <strong>{tours.length}</strong> tours
          </p>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{ width: 50, height: 50 }}></div>
            <p className="mt-3 text-muted">Loading tours...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-search display-1 text-muted"></i>
            <h4 className="mt-3 text-muted">No tours found</h4>
            <p className="text-muted">Try a different search term</p>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((tour) => (
              <div key={tour._id} className="col-md-4 col-sm-6">
                <TourCard tour={tour} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ToursPage;
