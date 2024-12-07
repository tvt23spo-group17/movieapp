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
            <ul className="review-list">
                {reviews.map((review) => (
                    // Use a unique key, e.g. review.review_id, which should be unique
                    <li
                        key={review.review_id}
                        onClick={() => handleReviewClick(review)}
                        style={{ cursor: 'pointer' }} // Add a pointer cursor to indicate clickable
                    >
                        <p><strong>{review.local_title}</strong></p>
                        <p>Review: {review.text}</p>
                        <p>Stars: {review.stars}</p>
                        <p>By: {review.email}</p>
                        <p>On: {new Date(review.timestamp).toLocaleString()}</p>
                    </li>
                ))}
            </ul>

            {/* Conditionally render the TmdbDetails component if showDetails is true and we have a selectedItem */}
            {showDetails && selectedItem && (
                <TmdbDetails
                    item={selectedItem}
                    onClose={handleCloseDetails}
                    category={selectedItem.itemCategory} // Pass the category
                />
            )}
        </div>
    );
};

export default Reviews;