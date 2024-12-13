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
        <div className='container-sm'>
          <h1>All Reviews</h1>
          {selectedItem ? (
            // If an item is selected, show TmdbDetails
            <TmdbDetails
              item={selectedItem}
              onClose={handleCloseDetails}
              category={selectedItem.itemCategory} 
            />
          ) : (
            // Otherwise, show the list of reviews
            <ul className="list-group">
              {reviews.map((review) => (
                <li className="list-group-item"
                  key={review.review_id}
                  onClick={() => handleReviewClick(review)}
                  style={{ cursor: 'pointer' }}
                >
                  <h4>{review.local_title}</h4>
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