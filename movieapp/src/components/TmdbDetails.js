import React, { useEffect, useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewSection from './ReviewSection';
import FavoritesToggle from './FavoritesToggle';
import { useUser } from '../context/UseUser';

const TmdbDetails = ({ item, onClose, category }) => {
  const [details, setDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        //const itemCategory = item.itemCategory || category;
        // Hardcoded movie for now
        const itemCategory = 'movie';
        const response = await fetch(
          `http://localhost:3001/details/${itemCategory}/${item.id}`
        );
        const data = await response.json();
        setDetails(data);
        const title = data.title || data.name;
        const releaseYear = data.release_date
          ? data.release_date.split('-')[0]
          : data.first_air_date
          ? data.first_air_date.split('-')[0]
          : '';
          if (title) {
            // Prepare query parameters
            const queryParams = new URLSearchParams();
            queryParams.append('title', title);
            if (releaseYear) {
              queryParams.append('year', releaseYear);
            }
  
            // Get or insert the TMDB ID and mapping
            const tmdbIdResponse = await fetch(
              `http://localhost:3001/api/get-tmdb-id?${queryParams.toString()}`
            );
            const tmdbIdData = await tmdbIdResponse.json();
  
            if (tmdbIdData.error) {
              console.error('Error fetching TMDB ID:', tmdbIdData.error);
            } else {
              // Update item.id and itemCategory with the tmdb_id and media_type from the mapping
              item.id = tmdbIdData.tmdb_id;
              item.itemCategory = tmdbIdData.media_type; // 'movie' or 'tv'
  
              // Fetch reviews using the updated tmdb_id
              fetchReviews(item.id);
            }
          } else {
            console.error('Title is undefined');
          }
        } catch (error) {
          console.error('Error fetching details or TMDB ID:', error);
        }
      };
    fetchDetails();
    fetchReviews();
  }, [item, category]);

  const handleReviewSubmitted = () => {
    // Re-fetch the reviews after a new review is submitted
    fetchReviews();
  };

  // Ensure fetchReviews is accessible
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/reviews/get-reviews?tmdb_id=${item.id}`
      );
      const data = await response.json();
      if (data.error) {
        console.error('Error fetching reviews:', data.error);
      } else {
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  if (!details) {
    return <p>Loading details...</p>;
  }

  return (
    <div className="movie-details">
      <button className="close-button" onClick={onClose}>
        Close
      </button>
      {(details.poster_path || details.profile_path) && (
        <img
          src={`https://image.tmdb.org/t/p/w300${
            details.poster_path || details.profile_path
          }`}
          alt={details.title || details.name}
        />
      )}
      <h2>{details.title || details.name}</h2>
      {category !== 'person' && (
        <>
          <p>
            <strong>Release Date:</strong>{' '}
            {details.release_date || details.first_air_date || 'N/A'}
          </p>
          <p>
            <strong>Rating:</strong> {details.vote_average}/10
          </p>
          <p>{details.overview}</p>
        </>
      )}
      {category === 'person' && details.biography && (
        <>
          <p>
            <strong>Born:</strong> {details.birthday || 'N/A'}
          </p>
          <p>{details.biography}</p>
        </>
      )}
      <FavoritesToggle tmdb_id={item.id} />
      {(category !== 'person' || 'tv') && (
        <>
          <ReviewSection 
            onClose={onClose}
            reviews={reviews}
            />
          {user ? (
            <ReviewForm
              tmdb_id={item.id}
              onReviewSubmitted={handleReviewSubmitted}
            />
          ) : (
            <p>Please log in to submit a review.</p>
          )}
        </>
      )}
    </div>
  );
};

export default TmdbDetails;