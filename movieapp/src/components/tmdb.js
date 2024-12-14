import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TmdbDetails from './TmdbDetails'; // Import the new component

const Tmdb = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [category, setCategory] = useState('movies');
  const [selectedItem, setSelectedItem] = useState(null); // New state for selected item

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
    setSelectedItem(null); // Reset selected item when category changes
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (category === 'search' && submittedSearchQuery !== '') {
          const response = await axios.get('http://localhost:3001/api/search', {
            params: {
              userQuery: submittedSearchQuery,
            },
          });
          setSearchResults(response.data.results);
        } else if (category !== 'search') {
          const response = await axios.get(`http://localhost:3001/api/${category}`);
          setItems(response.data.results);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [category, submittedSearchQuery]);

  const displayItems = category === 'search' ? searchResults : items;

  // Function to handle item click
  const handleItemClick = (item) => {
    let itemCategory = category;
    if (category === 'search') {
      itemCategory = item.media_type;
    }
    setSelectedItem({...item, itemCategory});
  };

  // Function to close the movie details
  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  return (
    <div className="container-sm">
      <h1 className='mb-3'>
        {category === 'movies' ? 'Popular Movies'
          : category === 'movies-trending' ? 'Trending Movies - Today'
          : category === 'movies-upcoming' ? 'Upcoming Movies'
          : category === 'tv' ? 'Popular TV Shows'
          : category === 'person' ? 'Popular Actors'
          : `Search Results for "${submittedSearchQuery}"`}
      </h1>

      <div className="container d-flex flex-column align-items-center">
      <div className="input-group mb-3 justify-content-center">
        <button
          className={`btn btn-secondary ${category === 'movies' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('movies')}
        >Popular Movies</button>
        <button
          className={`btn btn-secondary ${category === 'movies-trending' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('movies-trending')}
        >Trending Movies</button>
        <button
          className={`btn btn-secondary ${category === 'movies-upcoming' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('movies-upcoming')}
        >Upcoming Movies</button>

        {/*<button
          className={category === 'tv' ? 'active' : ''}
          onClick={() => handleCategoryChange('tv')}
        >
          TV Shows
        </button>
        <button
          className={category === 'person' ? 'active' : ''}
          onClick={() => handleCategoryChange('person')}
        >
          Actors
        </button>*/}
        </div>
        <div className="input-group mb-3 justify-content-center" style={{ maxWidth: '450px', width: '100%' }}>
          <input
            className="form-control"
            id="search"
            type="text"
            placeholder="Search movies"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        <button className="btn btn-secondary" onClick={handleSearchSubmit}>Search</button>
      </div>
      </div>
      
      {selectedItem ? (
        // Render TmdbDetails when item is selected
        <TmdbDetails item={selectedItem} onClose={handleCloseDetails} />
      ) : (
        <div className="container movie-list">
          <div className="row movie-list gx-4 gy-4 justify-content-center">
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <div
                key={item.id}
                className="movie-card col-9 col-sm-6 col-md-4 col-lg-3"
                onClick={() => handleItemClick(item)}
              >
                <div className="card h-100">
                {(item.poster_path || item.profile_path) && (
                  <div className="d-flex justify-content-center align-items-center" style={{}}>
                  <img
                    className="card-img-top"
                    src={`https://image.tmdb.org/t/p/w200${item.poster_path || item.profile_path}`}
                    alt={item.title || item.name}
                    style={{ objectFit: "cover" }}
                  />
                  </div>
                )}
                <div className="card-body">
                <h4 className="h4 mt-2">{item.title || item.name}</h4>
                {category !== 'person' && (
                  <>
                    <p className="card-text">
                      <strong>Release Date:</strong>{' '}
                      {item.release_date || item.first_air_date || 'N/A'}
                    </p>
                    <p className="card-text">{item.overview}</p>
                  </>
                )}
              </div>
              </div>
              </div>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

export default Tmdb;