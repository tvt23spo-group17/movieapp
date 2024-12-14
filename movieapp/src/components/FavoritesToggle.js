import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UseUser';

const FavoritesToggle = ({ tmdb_id }) => {
  const { user } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);

  const user_id = user?.userId;

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user_id) return;
      try {
        const response = await fetch(`http://localhost:3001/api/favorites/is-favorite?user_id=${user_id}&tmdb_id=${tmdb_id}`);
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [user_id, tmdb_id]);

  const handleToggleFavorite = async () => {
    if (!user_id) {
      alert('You must be logged in to manage favorites.');
      return;
    }

    try {
      const endpoint = isFavorite 
        ? 'http://localhost:3001/favorites/delete' 
        : 'http://localhost:3001/favorites/add';

      const response = await fetch(endpoint, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, tmdb_id })
      });

      const data = await response.json();

      if (response.ok) {
        setIsFavorite(!isFavorite);
      } else {
        console.error('Error toggling favorite status:', data.error || data.message);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (!user_id) {
    return null; // or a message prompting login
  }

  return (
    <button type='button' className='btn btn-secondary mb-2' onClick={handleToggleFavorite}>
      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
    </button>
  );
};

export default FavoritesToggle;