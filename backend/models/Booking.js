// ============================================================
// models/Booking.js - MongoDB schema for Tour Bookings
// ============================================================

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to User
      ref: 'User',
      required: true,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to Tour
      ref: 'Tour',
      required: true,
    },
    travelers: {
      type: Number,
      required: [true, 'Number of travelers is required'],
      min: [1, 'At least 1 traveler required'],
    },
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required'],
    },
    totalPrice: {
      type: Number,
      required: true,       // Calculated as price × travelers
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
