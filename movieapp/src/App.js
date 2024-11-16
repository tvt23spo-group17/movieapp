import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [category, setCategory] = useState('movies');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      setSubmittedSearchQuery(searchQuery.trim());
      setCategory('search');
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchResults([]);
    setSubmittedSearchQuery('');
    setSearchQuery('');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (category === 'search' && submittedSearchQuery !== '') {
          const response = await axios.get('http://localhost:5000/api/search', {
            params: {
              userQuery: submittedSearchQuery,
            },
          });
          setSearchResults(response.data.results);
        } else if (category !== 'search') {
          const response = await axios.get(`http://localhost:5000/api/${category}`);
          setItems(response.data.results);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [category, submittedSearchQuery]);

  const displayItems = category === 'search' ? searchResults : items;

  return (
    <div className="App">
      <h1>
        {category === 'movies' ? 'Popular Movies'
          : category === 'tv' ? 'Popular TV Shows'
          : category === 'person' ? 'Popular Actors'
          : `Search Results for "${submittedSearchQuery}"`}
      </h1>

      <div className="navigation">
        <button
          className={category === 'movies' ? 'active' : ''}
          onClick={() => handleCategoryChange('movies')}
        >Movies</button>
        <button
          className={category === 'tv' ? 'active' : ''}
          onClick={() => handleCategoryChange('tv')}
        >TV Shows</button>
        <button
          className={category === 'person' ? 'active' : ''}
          onClick={() => handleCategoryChange('person')}
        >Actors</button>

        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search movies and TV shows"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}/>
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="movie-list">
        {displayItems.length > 0 ? (
          displayItems.map((item) => (
            <div key={item.id} className="movie-card">
              {(item.poster_path || item.profile_path) && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${item.poster_path || item.profile_path}`}
                  alt={item.title || item.name}
                />
              )}
              <h2>{item.title || item.name}</h2>
              {category !== 'person' && (
              <>
                <p>
                  <strong>Release Date:</strong>{' '}
                  {item.release_date || item.first_air_date || 'N/A'}
                </p>
                <p>{item.overview}</p>
              </>
              )}
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default App;