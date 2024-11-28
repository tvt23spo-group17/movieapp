import { useState } from 'react';
import { useUser } from '../context/UseUser';

const ReviewForm = ({ tmdb_id, onReviewSubmitted }) => {
  const [text, setText] = useState('');
  const [stars, setStars] = useState(5);
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user_id = user.userId;

    if (!user_id) {
      console.error('User is not authenticated.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/reviews/add-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, tmdb_id, text, stars }),
      });
      const data = await response.json();

      if (data.error) {
        console.error('Error submitting review:', data.error);
      } else {
        console.log(data.message);
        setText('');
        setStars(5);
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Stars:</label>
        <select
          value={stars}
          onChange={(e) => setStars(parseInt(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Review:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;