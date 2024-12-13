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
      <h3>Favorite Movies</h3>
      {movies.length === 0 ? (
        <p>No favorite movies found for this user.</p>
      ) : (
        <ul className="list-group">
          {movies.map((movie) => (
            <li className="list-group-item link-light link-offset-2"
              key={movie.tmdb_id} 
              onClick={() => onMovieClick({ id: movie.tmdb_id })}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              {movie.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesList;