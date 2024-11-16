const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const TMDB_TOKEN = process.env.TMDB_TOKEN;

app.get('/api/movies', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular`,
      {
        params: {
          language: 'en-US',
          page: 1,
        },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from TMDb:', error);
    res.status(500).json({ error: 'Failed to fetch data from TMDb' });
  }
});

app.get('/api/tv', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/popular`,
      {
        params: {
          language: 'en-US',
          page: 1,
        },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching TV shows from TMDb:', error);
    res.status(500).json({ error: 'Failed to fetch TV shows from TMDb' });
  }
});

app.get('/api/person', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/popular`,
      {
        params: {
          language: 'en-US',
          page: 1
        },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching popular people from TMDb:', error);
    res.status(500).json({ error: 'Failed to fetch popular people from TMDb' });
  }
});

app.get('/api/search', async (req, res) => {
  const { userQuery } = req.query;
  if (!userQuery || userQuery.trim() === '') {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/multi`,
      {
        params: {
          query: userQuery,
          language: 'en-US',
          page: 1
        },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching search results from TMDb:', error);
    res.status(500).json({ error: 'Failed to fetch search results from TMDb' });
  }
});

/*app.get('/api/advancedSearch', async (req, res) => {
  const { query, type } = req.query;

  if (!query || !type) {
    return res.status(400).json({ error: 'Missing query or type parameter' });
  }

  if (['movie', 'tv', 'person'].includes(type)) {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/${type}`, {
        params: {
          query: query,
          language: 'en-US',
          page: 1,
          include_adult: false,
        },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
      });
      res.json(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data from TMDb:', error);
      res.status(500).json({ error: 'Failed to fetch data from TMDb' });
    }
  } else {
    res.status(400).json({ error: 'Invalid type parameter' });
  }
});
*/

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});