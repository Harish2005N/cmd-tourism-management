// ============================================================
// routes/bookingRoutes.js - Tour booking endpoints
// ============================================================

const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ── POST /api/bookings ────────────────────────────────────────
// Create a new booking (logged-in users only)
router.post('/', protect, async (req, res) => {
  try {
    const { tourId, travelers, travelDate } = req.body;

    // Find the tour
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    // Check if enough seats are available
    if (tour.availableSeats < travelers) {
      return res.status(400).json({
        message: `Only ${tour.availableSeats} seats available`,
      });
    }

    // Calculate total price
    const totalPrice = tour.price * travelers;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      tour: tourId,
      travelers,
      travelDate,
      totalPrice,
    });

    // Reduce available seats in the tour
    tour.availableSeats -= travelers;
    await tour.save();

    // Populate tour and user details in the response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('tour', 'name destination price duration')
      .populate('user', 'name email');

    res.status(201).json({
      message: 'Booking placed! Pending admin confirmation.',
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── GET /api/bookings/my ──────────────────────────────────────
// Get current user's booking history
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('tour', 'name destination price duration image')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── GET /api/bookings ─────────────────────────────────────────
// Get ALL bookings (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('tour', 'name destination price')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── PUT /api/bookings/:id/cancel ──────────────────────────────
// Cancel a booking
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only the owner or admin can cancel
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    // Restore seats to the tour
    await Tour.findByIdAndUpdate(booking.tour, {
      $inc: { availableSeats: booking.travelers },
    });

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── PUT /api/bookings/:id/confirm ─────────────────────────────
// Confirm a pending booking (admin only)
router.put('/:id/confirm', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status === 'confirmed') {
      return res.status(400).json({ message: 'Booking is already confirmed' });
    }

    if (booking.status === 'cancelled') {
        return res.status(400).json({ message: 'Cannot confirm a cancelled booking' });
    }

    booking.status = 'confirmed';
    await booking.save();

    res.json({ message: 'Booking confirmed successfully!', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
