// ============================================================
// components/common/StarRating.js - Display star ratings
// ============================================================

import React from 'react';

// Displays filled/empty stars based on rating value (1–5)
function StarRating({ rating }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`bi ${star <= rating ? 'bi-star-fill star-filled' : 'bi-star star-empty'}`}
        ></i>
      ))}
    </span>
  );
}

export default StarRating;
