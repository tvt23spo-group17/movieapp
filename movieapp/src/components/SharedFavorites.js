import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const SharedFavorites = () => {
    const { favorite_list_id } = useParams();
    const [listData, setListData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchFavorites = async () => {
        try {
          const response = await fetch(`http://localhost:3001/share/${favorite_list_id}`);
          if (!response.ok) {
            throw new Error('List not found');
          }
          const data = await response.json();
          setListData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchFavorites();
    }, [favorite_list_id]);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!listData) return <p>No data</p>;
  
    return (
      <div>
        <h1>{listData.name}{' -list '}from user:{' '}<Link to={`/Profile/${listData.user_id}`}>{listData.email}</Link></h1>
        <ul>
          {listData.movies.map(movie => (
            <li key={movie.tmdb_id}>
              {movie.local_title} (TMDB ID: {movie.tmdb_id})
            </li>
          ))}
        </ul>
      </div>
    );
  };

export default SharedFavorites;