import React, { useEffect, useState } from 'react';

const FavoritesList = ({ userId, onMovieClick }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:3001/favorites/${userId}`);
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [userId]);

  return (
    <div className="favorites-list">
      <h2>Favorite Movies</h2>
      {movies.length === 0 ? (
        <p>No public favorite movies found for this user.</p>
      ) : (
        <ul>
          {movies.map((movie) => (
            <li 
              key={movie.tmdb_id} 
              onClick={() => onMovieClick({ id: movie.tmdb_id })}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              {movie.title} (Click to view details)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesList;