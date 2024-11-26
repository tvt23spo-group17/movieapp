import { useState, useEffect } from 'react';
import React from 'react';

const Finnkino = () => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [currentDate, setCurrentDate] = useState(getToday());
  const [schedules, setSchedules] = useState([]);
  const [dateOptions, setDateOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  function getToday() {
    const today = new Date();
    return today.toLocaleDateString('fi-FI');
  }

  function generateNextWeekDates() {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + i);
      const formattedDate = nextDate.toLocaleDateString('fi-FI');
      dates.push(formattedDate);
    }
    return dates;
  }

  const getTheatres = (xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'application/xml');
    const theatreElements = xmlDoc.getElementsByTagName('TheatreArea');
    const tempAreas = [];
    for (let i = 0; i < theatreElements.length; i++) {
      const id = theatreElements[i].getElementsByTagName('ID')[0]?.textContent;
      const name = theatreElements[i].getElementsByTagName('Name')[0]?.textContent;
      if (id && name) {
        tempAreas.push({ id, name });
      }
    }
    setAreas(tempAreas);
    console.log(tempAreas);
  };

  useEffect(() => {
    fetch('https://www.finnkino.fi/xml/TheatreAreas/')
      .then((response) => response.text())
      .then((xml) => {
        getTheatres(xml);
      })
      .catch((error) => {
        console.log('Error fetching theater areas:', error);
      });
    setDateOptions(generateNextWeekDates());
  }, []);

  const fetchSchedule = async (date, area) => {
    if (!area || !date) {
      console.log('Area or date is missing');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://www.finnkino.fi/xml/Schedule/?area=${area}&dt=${date}`);
      const xmlText = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
      const shows = xmlDoc.getElementsByTagName('Show');

      if (shows.length === 0) {
        console.log('No shows available');
        setSchedules([]);
        setLoading(false);
        return;
      }

      const schedulesData = Array.from(shows).map((show) => {
        const title = show.getElementsByTagName('Title')[0]?.textContent;
        const eventTime = show.getElementsByTagName('dttmShowStart')[0]?.textContent;
        const productionYear = show.getElementsByTagName('ProductionYear')[0]?.textContent;

        return { title, eventTime, productionYear };
      });

      setSchedules(schedulesData);
      console.log(schedulesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedule', error);
      setLoading(false);
    }
  };

  const handleAreaChange = (e) => {
    const area = e.target.value;
    setSelectedArea(area);
    if (currentDate) {
      fetchSchedule(currentDate, area);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setCurrentDate(date);
    if (selectedArea) {
      fetchSchedule(date, selectedArea);
    }
  };

  const handleReviewClick = async (schedule) => {
    setSelectedMovie(schedule);
    setShowReviewModal(true);
  
    // Fetch TMDB ID
    try {
      const response = await fetch(
        `http://localhost:3001/api/get-tmdb-id?title=${encodeURIComponent(
          schedule.title
        )}&year=${schedule.productionYear}`
      );
      const data = await response.json();
  
      if (data.error) {
        console.error('Error fetching TMDB ID:', data.error);
        alert(`TMDB Error: ${data.error}`);
      } else {
        const tmdb_id = data.tmdb_id;
        schedule.tmdb_id = tmdb_id; // Attach tmdb_id to the schedule
  
        // Fetch reviews for this movie
        fetchReviews(tmdb_id);
      }
    } catch (error) {
      console.error('Error fetching TMDB ID:', error);
    }
  };

  const fetchReviews = async (tmdb_id) => {
    try {
      const response = await fetch(`http://localhost:3001/reviews/get-reviews?tmdb_id=${tmdb_id}`);
      const data = await response.json();

      if (data.error) {
        console.error('Error fetching reviews:', data.error);
      } else {
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  return (
    <div>
      <h1>Finnkino Theatres</h1>
      <select onChange={handleAreaChange} value={selectedArea}>
        <option value="">Select Area</option>
        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}
          </option>
        ))}
      </select>
      <select onChange={handleDateChange} value={currentDate}>
        {dateOptions.map((date, index) => (
          <option key={index} value={date}>
            {date}
          </option>
        ))}
      </select>

      <div>
        {loading ? (
          <p>Loading...</p>
        ) : schedules.length > 0 ? (
          schedules.map((schedule, index) => {
            const eventDate = new Date(schedule.eventTime);
            const formattedEventTime = eventDate.toLocaleString('fi-FI');
            return (
              <div key={index}>
                <strong>
                  {schedule.title} {schedule.productionYear ? `(${schedule.productionYear})` : ''}
                </strong>{' '}
                - {formattedEventTime}
                <button onClick={() => handleReviewClick(schedule)}>Review</button>
              </div>
            );
          })
        ) : (
          <p>No schedules available</p>
        )}
      </div>

      {showReviewModal && selectedMovie && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {selectedMovie.title} {selectedMovie.productionYear ? `(${selectedMovie.productionYear})` : ''}
            </h2>
            <button onClick={() => setShowReviewModal(false)}>Close</button>
            <h3>Reviews:</h3>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index}>
                  <p>
                    <strong>{review.user_email}</strong> ({review.stars} stars):
                  </p>
                  <p>{review.text}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
            <h3>Submit a Review:</h3>
            <ReviewForm tmdb_id={selectedMovie.tmdb_id} />
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewForm = ({ tmdb_id }) => {
  const [text, setText] = useState('');
  const [stars, setStars] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assume user_id is obtained from authentication
    const user_id = 1; // Placeholder value

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
        // Optionally, refresh reviews
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Stars:</label>
        <select value={stars} onChange={(e) => setStars(e.target.value)}>
          {[1, 2, 3, 4, 5].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Review:</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} required />
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default Finnkino;