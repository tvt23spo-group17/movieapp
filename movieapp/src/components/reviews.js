import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TmdbDetails from './TmdbDetails';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetails, setShowDetails] = useState(false);


    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('http://localhost:3001/reviews/all-reviews');
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error.message);
            }
        };

        fetchReviews();
    }, []);
    const handleReviewClick = (review) => {
        const selected = {
            id: review.tmdb_id,
            itemCategory: 'movie',
            local_title: review.local_title
        };

        setSelectedItem(selected);
        setShowDetails(true);
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedItem(null);
    };


    return (
        <div>
          <h2>All Reviews</h2>
          {selectedItem ? (
            // If an item is selected, show TmdbDetails
            <TmdbDetails
              item={selectedItem}
              onClose={handleCloseDetails}
              category={selectedItem.itemCategory} 
            />
          ) : (
            // Otherwise, show the list of reviews
            <ul className="review-list">
              {reviews.map((review) => (
                <li
                  key={review.review_id}
                  onClick={() => handleReviewClick(review)}
                  style={{ cursor: 'pointer' }}
                >
                  <p><strong>{review.local_title}</strong></p>
                  <p>Review: {review.text}</p>
                  <p>Stars: {review.stars}</p>
                  <p>By: {review.email}</p>
                  <p>On: {new Date(review.timestamp).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
};

export default Reviews;