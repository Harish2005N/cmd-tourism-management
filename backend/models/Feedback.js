// ============================================================
// models/Feedback.js - MongoDB schema for Tour Feedback
// ============================================================

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

// One user can submit only one feedback per tour
feedbackSchema.index({ user: 1, tour: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
