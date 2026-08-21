// ============================================================
// middleware/authMiddleware.js - Protect routes with JWT
// ============================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── protect: Check if user is logged in ─────────────────────
const protect = async (req, res, next) => {
  let token;

  // JWT is sent in Authorization header: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify it
      req.user = await User.findById(decoded.id).select('-password'); // Attach user to request
      
      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists, please log in again' });
      }

      next(); // Move to next middleware / route handler
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// ── adminOnly: Check if user is admin ───────────────────────
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = { protect, adminOnly };
