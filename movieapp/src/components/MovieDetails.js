// MovieDetails.js
import React from 'react';
import ReviewForm from './ReviewForm';
import ReviewSection from './ReviewSection';
import { useUser } from '../context/UseUser';
import FavoritesToggle from './FavoritesToggle';
import axios from 'axios';

const MovieDetails = ({
  selectedMovie,
  setShowReviewModal,
  reviews,
  fetchReviews
}) => {
  const { user } = useUser();
  const user_id = user.userId
  const handleReviewSubmitted = () => {
    fetchReviews(selectedMovie.tmdb_id);
  };
  const eventDate = new Date(selectedMovie.eventTime);
  const formattedEventTime = eventDate.toLocaleString('fi-FI');

const handleGroupMovie = (user) => {
  if (!user) {
    
    return; 
  }

 axios.post(`http://localhost:3001/groupMember/movie_sched/${user_id}`,{
  local_title: selectedMovie.title,
  show_time: selectedMovie.eventTime
  
})
  .then(response => {
    
    }).catch(error =>{
      console.log(error.response)
      })

} 


  return (
    <div className="finnkino-details">
      <div className="modal-content">
        <h2 className='text-center'>
          {selectedMovie.title}{' '}
          {selectedMovie.productionYear
            ? `(${selectedMovie.productionYear})`
            : ''}
        </h2>
        <img src={selectedMovie.eventMediumImagePortrait} alt={selectedMovie.title} />
        <p>{selectedMovie.genres}<img className='rating-img' src={selectedMovie.ratingImageUrl} /></p>
        <p>{selectedMovie.presentationMethodAndLanguage}</p>
        <p>{formattedEventTime}{' '}{selectedMovie.theatreAuditorium}</p>
        {user && selectedMovie.tmdb_id && (
          <FavoritesToggle tmdb_id={selectedMovie.tmdb_id} />
        )}
        <button className="btn btn-secondary mb-2" onClick={handleGroupMovie}>Talleta näytösaika</button>
        <ReviewSection
          onClose={() => setShowReviewModal(false)}
          setShowReviewModal={setShowReviewModal}
          reviews={reviews}
        />
        {user ? (
        <ReviewForm
          tmdb_id={selectedMovie.tmdb_id}
          onReviewSubmitted={handleReviewSubmitted}
        /> ) : (
          <p>Please log in to submit a review.</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
