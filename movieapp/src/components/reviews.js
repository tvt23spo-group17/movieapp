import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);

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

    return (
        <div>
            <h2>Reviews</h2>
            <ul>
                {reviews.map((review) => (
                    <li key={review.tmdb_id}>
                        <p><strong>{review.local_title}</strong></p>
                        <p>{review.text}</p>
                        <p>Rating: {review.stars}</p>
                        <p>By: {review.email}</p>
                        <p>On: {new Date(review.timestamp).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reviews;