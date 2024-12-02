import React from 'react';

const ReviewSection = ({ onClose, reviews }) => {
  return (
    <>
      <button onClick={onClose}>Close</button>
      <h3>Reviews:</h3>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index}>
            <p>
              <strong>{review.user_email}</strong> ({review.stars} stars):
            </p>
            <p>{review.text}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </>
  );
};

export default ReviewSection;