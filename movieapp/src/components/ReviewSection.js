import React from 'react';
import { Link } from 'react-router-dom';

const ReviewSection = ({ onClose, reviews }) => {
  return (
    <>
      <button className='btn btn-secondary mb-3' onClick={onClose}>Close</button>
      <h3>Reviews:</h3>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index}>
            <p>
              <strong><Link className="link-light link-offset-2" to={`/Profile/${review.user_id}`}>{review.user_email}</Link></strong> ({review.stars} stars):
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