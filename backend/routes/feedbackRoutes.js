// ============================================================
// routes/feedbackRoutes.js - Tour feedback & ratings
// ============================================================

const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ── POST /api/feedback ────────────────────────────────────────
// Submit feedback for a tour (logged-in users only)
router.post('/', protect, async (req, res) => {
  try {
    const { tourId, rating, comment } = req.body;

    // Check if user already submitted feedback for this tour
    const existing = await Feedback.findOne({ user: req.user._id, tour: tourId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this tour' });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      tour: tourId,
      rating,
      comment,
    });

    const populated = await Feedback.findById(feedback._id)
      .populate('user', 'name')
      .populate('tour', 'name');

    res.status(201).json({ message: 'Feedback submitted! Thank you.', feedback: populated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── GET /api/feedback/tour/:tourId ────────────────────────────
// Get all feedback for a specific tour (public)
router.get('/tour/:tourId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ tour: req.params.tourId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── GET /api/feedback ─────────────────────────────────────────
// Get ALL feedback (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'name email')
      .populate('tour', 'name destination')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── DELETE /api/feedback/:id ──────────────────────────────────
// Delete feedback (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
