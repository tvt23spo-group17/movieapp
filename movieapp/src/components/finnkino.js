import { useState, useEffect } from 'react';
import React from 'react';
import MovieDetails from './MovieDetails';

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
        const eventSmallImagePortrait = show.getElementsByTagName('EventSmallImagePortrait')[0]?.textContent;
        const title = show.getElementsByTagName('Title')[0]?.textContent;
        const eventTime = show.getElementsByTagName('dttmShowStart')[0]?.textContent;
        const productionYear = show.getElementsByTagName('ProductionYear')[0]?.textContent;
        const theatreAuditorium = show.getElementsByTagName('TheatreAuditorium')[0]?.textContent;
        const eventMediumImagePortrait = show.getElementsByTagName('EventMediumImagePortrait')[0]?.textContent;
        const genres = show.getElementsByTagName('Genres')[0]?.textContent;
        const presentationMethodAndLanguage = show.getElementsByTagName('PresentationMethodAndLanguage')[0]?.textContent;
        const ratingImageUrl = show.getElementsByTagName('RatingImageUrl')[0]?.textContent;

        return { title, eventTime, productionYear, eventSmallImagePortrait, eventMediumImagePortrait, theatreAuditorium, genres, presentationMethodAndLanguage, ratingImageUrl };
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
          schedule.title)}&year=${schedule.productionYear}`
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
    <div className='container'>
      <h1 className='mb-4'>Finnkino Theatres</h1>
      <div className='row gx-3 mb-4'>
      <div className='col'>
      <select className='form-select col' data-bs-theme='dark' onChange={handleAreaChange} value={selectedArea}>
        <option value="">Select Area</option>
        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}
          </option>
        ))}
      </select>
      </div>
      <div className='col'>
      <select className='form-select' onChange={handleDateChange} value={currentDate}>
        {dateOptions.map((date, index) => (
          <option key={index} value={date}>
            {date}
          </option>
        ))}
      </select>
      </div>
      </div>
      
      <div className='row'>
      <div className='col-6'>
        {loading ? (
          <p>Loading...</p>
        ) : schedules.length > 0 ? (
          schedules.map((schedule, index) => {
            const eventDate = new Date(schedule.eventTime);
            const formattedEventTime = eventDate.toLocaleString('fi-FI');
            return (
              <div className="finnkino-item" key={index}>
                <strong onClick={() => handleReviewClick(schedule)}>
                  <img src={schedule.eventSmallImagePortrait}></img> 
                </strong>{' '}
                <div>
                <p><strong>
                  {schedule.title} 
                  {schedule.productionYear ? `(${schedule.productionYear})` : ''}
                </strong></p>
                <p>{formattedEventTime} {schedule.theatreAuditorium}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No schedules available</p>
        )}
      </div>
      <div className='col-6'>
      {showReviewModal && selectedMovie && (
        <MovieDetails
          selectedMovie={selectedMovie}
          setShowReviewModal={setShowReviewModal}
          reviews={reviews}
          fetchReviews={fetchReviews}
        />
      )}
    </div>
    </div>
    </div>
  );
};

export default Finnkino;