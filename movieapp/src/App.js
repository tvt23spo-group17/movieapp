import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchMode, setSearchMode] = useState('basic'); // 'basic' or 'advanced'
  const [category, setCategory] = useState('movies');
  const [basicSearchQuery, setBasicSearchQuery] = useState('');
  const [submittedBasicSearchQuery, setSubmittedBasicSearchQuery] = useState('');
  const [advancedSearchQuery, setAdvancedSearchQuery] = useState('');
  const [submittedAdvancedSearchQuery, setSubmittedAdvancedSearchQuery] = useState('');
  const [advancedSearchType, setAdvancedSearchType] = useState('movie'); // 'movie', 'tv', 'person'
  const [items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const handleBasicSearchSubmit = (e) => {
    e.preventDefault();
    if (basicSearchQuery.trim() !== '') {
      setSubmittedBasicSearchQuery(basicSearchQuery.trim());
      setCategory('basicSearch');
    }
  };
  const handleAdvancedSearchSubmit = (e) => {
    e.preventDefault();
    if (advancedSearchQuery.trim() !== '') {
      setSubmittedAdvancedSearchQuery(advancedSearchQuery.trim());
      setCategory('advancedSearch');
    }
  };
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchResults([]);
    setSubmittedBasicSearchQuery('');
    setSubmittedAdvancedSearchQuery('');
    setBasicSearchQuery('');
    setAdvancedSearchQuery('');
  };
  const handleSearchModeChange = (mode) => {
    setSearchMode(mode);
    setSearchResults([]);
    setSubmittedBasicSearchQuery('');
    setSubmittedAdvancedSearchQuery('');
    setBasicSearchQuery('');
    setAdvancedSearchQuery('');
    setCategory('movies'); // or 'tv'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (category === 'basicSearch' && submittedBasicSearchQuery !== '') {
          // Search (Multi)
          const response = await axios.get('http://localhost:5000/api/search', {
            params: {
              userQuery: submittedBasicSearchQuery,
            },
          });
          setSearchResults(response.data.results);
        } else if (category === 'advancedSearch' && submittedAdvancedSearchQuery !== '') {
          // Advanced Search
          const response = await axios.get('http://localhost:5000/api/advancedSearch', {
            params: {
              query: submittedAdvancedSearchQuery,
              type: advancedSearchType,
            },
          });
          setSearchResults(response.data.results);
        } else if (category !== 'basicSearch' && category !== 'advancedSearch') {
          // Default popular movies or TV shows
          const response = await axios.get(`http://localhost:5000/api/${category}`);
          setItems(response.data.results);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [category, submittedBasicSearchQuery, submittedAdvancedSearchQuery, advancedSearchType]);

  const displayItems =
    category === 'basicSearch' || category === 'advancedSearch' ? searchResults : items;

  return (
    <div className="App">
      <h1>
        {category === 'movies'
          ? 'Popular Movies'
          : category === 'tv'
          ? 'Popular TV Shows'
          : category === 'basicSearch'
          ? `Search Results for "${submittedBasicSearchQuery}"`
          : category === 'advancedSearch'
          ? `Advanced Search Results for "${submittedAdvancedSearchQuery}" (${advancedSearchType})`
          : ''}
      </h1>
      <div className="navigation">
        <button
          className={category === 'movies' ? 'active' : ''}
          onClick={() => handleCategoryChange('movies')}
        >
          Movies
        </button>
        <button
          className={category === 'tv' ? 'active' : ''}
          onClick={() => handleCategoryChange('tv')}
        >
          TV Shows
        </button>
      </div>

      <div className="search-mode-toggle">
        <button
          className={searchMode === 'basic' ? 'active' : ''}
          onClick={() => handleSearchModeChange('basic')}
        >
          Basic Search
        </button>
        <button
          className={searchMode === 'advanced' ? 'active' : ''}
          onClick={() => handleSearchModeChange('advanced')}
        >
          Advanced Search
        </button>
      </div>

      {searchMode === 'basic' ? (
        <form className="search-form" onSubmit={handleBasicSearchSubmit}>
          <input
            type="text"
            placeholder="Search movies and TV shows"
            value={basicSearchQuery}
            onChange={(e) => setBasicSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        ) : (
        <form className="search-form" onSubmit={handleAdvancedSearchSubmit}>
          <div className="radio-buttons">
            <label>
              <input
                type="radio"
                value="movie"
                checked={advancedSearchType === 'movie'}
                onChange={(e) => setAdvancedSearchType(e.target.value)}
              />
              Movies
            </label>
            <label>
              <input
                type="radio"
                value="tv"
                checked={advancedSearchType === 'tv'}
                onChange={(e) => setAdvancedSearchType(e.target.value)}
              />
              TV Shows
            </label>
            <label>
              <input
                type="radio"
                value="person"
                checked={advancedSearchType === 'person'}
                onChange={(e) => setAdvancedSearchType(e.target.value)}
              />
              Actors
            </label>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={advancedSearchQuery}
            onChange={(e) => setAdvancedSearchQuery(e.target.value)}
          />
          <button type="submit">Advanced Search</button>
        </form>
      )}

      <div className="movie-list">
        {displayItems.length > 0 ? (
          displayItems.map((item) => (
            <div key={item.id} className="movie-card">
              {item.profile_path || item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${
                    item.profile_path || item.poster_path
                  }`}
                  alt={item.title || item.name}
                />
              ) : null}
              <h2>{item.title || item.name}</h2>
              {item.known_for_department && (
                <p>
                  <strong>Known For:</strong> {item.known_for_department}
                </p>
              )}
              {(item.release_date || item.first_air_date) && (
                <p>
                  <strong>Release Date:</strong>{' '}
                  {item.release_date || item.first_air_date || 'N/A'}
                </p>
              )}
              {item.overview && <p>{item.overview}</p>}
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