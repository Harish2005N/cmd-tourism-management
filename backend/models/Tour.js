// ============================================================
// models/Tour.js - MongoDB schema for Tour Packages
// ============================================================

const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: Number,          // Number of days
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 day'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Available seats is required'],
      min: [0, 'Seats cannot be negative'],
    },
images: [{
      type: String,          // Multiple image URLs
    }],
    itinerary: [
      {
        day: { type: Number, required: true },
        location: { type: String, required: true },
        activities: { type: String, required: true },
      }
    ],
    isActive: {
      type: Boolean,
      default: true,         // Admin can deactivate tours
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tour', tourSchema);
