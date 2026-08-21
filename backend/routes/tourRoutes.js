// ============================================================
// routes/tourRoutes.js - CRUD operations for Tour Packages
// ============================================================

const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ── GET /api/tours ────────────────────────────────────────────
// Get all active tours (public - anyone can view)
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── GET /api/tours/all ────────────────────────────────────────
// Get ALL tours including inactive (admin only)
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── GET /api/tours/:id ────────────────────────────────────────
// Get single tour by ID
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── POST /api/tours ───────────────────────────────────────────
// Create a new tour (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const tourData = {
      ...req.body,
      itinerary: req.body.itinerary || [],
      price: Number(req.body.price),
      duration: Number(req.body.duration),
      availableSeats: Number(req.body.availableSeats),
    };
    const tour = await Tour.create(tourData);
    res.status(201).json({ message: 'Tour created successfully!', tour });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── PUT /api/tours/:id ────────────────────────────────────────
// Update a tour (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,        // Return the updated document
      runValidators: true,
    });
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json({ message: 'Tour updated successfully!', tour });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── DELETE /api/tours/:id ─────────────────────────────────────
// Delete a tour (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json({ message: 'Tour deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
