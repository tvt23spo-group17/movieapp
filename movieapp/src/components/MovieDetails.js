// MovieDetails.js
import React from 'react';
import ReviewForm from './ReviewForm';
import ReviewSection from './ReviewSection';

const MovieDetails = ({
  selectedMovie,
  setShowReviewModal,
  reviews,
  fetchReviews,
}) => {
  const handleReviewSubmitted = () => {
    fetchReviews(selectedMovie.tmdb_id);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>
          {selectedMovie.title}{' '}
          {selectedMovie.productionYear
            ? `(${selectedMovie.productionYear})`
            : ''}
        </h2>
        <ReviewSection
          setShowReviewModal={setShowReviewModal}
          reviews={reviews}
        />
        <ReviewForm
          tmdb_id={selectedMovie.tmdb_id}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>
    </div>
  );
};

export default MovieDetails;