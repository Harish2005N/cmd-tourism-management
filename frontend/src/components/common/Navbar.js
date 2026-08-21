// ============================================================
// components/common/Navbar.js - Top navigation bar
// ============================================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow">
      <div className="container">
        {/* Brand / Logo */}
        <Link className="navbar-brand" to="/">
          <i className="bi bi-airplane-fill me-2"></i>TourGo
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tours">Tours</Link>
            </li>

            {/* Show only when logged in as regular user */}
            {user && user.role === 'user' && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-bookings">My Bookings</Link>
              </li>
            )}

            {/* Show admin links */}
            {user && user.role === 'admin' && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  Admin
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/admin">Dashboard</Link></li>
                  <li><Link className="dropdown-item" to="/admin/tours">Manage Tours</Link></li>
                  <li><Link className="dropdown-item" to="/admin/bookings">Bookings</Link></li>
                  <li><Link className="dropdown-item" to="/admin/feedback">Feedback</Link></li>
                </ul>
              </li>
            )}
          </ul>

          {/* Auth buttons */}
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item d-flex align-items-center">
                  <span className="text-white me-3">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.name}
                    {user.role === 'admin' && (
                      <span className="badge bg-warning text-dark ms-2">Admin</span>
                    )}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light btn-sm ms-2 mt-1" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
