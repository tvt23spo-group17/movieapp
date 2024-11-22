import { useState, useEffect, useRef } from 'react';
import React from 'react';

const Finnkino = () => {
const [areas, setAreas] = useState([]);
const [selectedArea, setSelectedArea] = useState(""); 
const [currentDate, setCurrentDate] = useState(getToday());
const [schedules, setSchedules] = useState([]);
const [dateOptions, setDateOptions] = useState([]);


function getToday() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; 
  const year = today.getFullYear();
  return `${day < 10 ? `0${day}` : day}.${month < 10 ? `0${month}` : month}.${year}`; 
}

function generateNextWeekDates() {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + i); 
    const day = nextDate.getDate();
    const month = nextDate.getMonth() + 1; 
    const year = nextDate.getFullYear();
    dates.push(`${day < 10 ? `0${day}` : day}.${month < 10 ? `0${month}` : month}.${year}`);
  }
  console.log(dates)
  return dates;
}


const getTheatres = (xml) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'application/xml');
  const root = xmlDoc.children;
  const theatres = root[0].children;
  const tempAreas = [];
  for (let i = 0; i < theatres.length; i++) {
    tempAreas.push({
      id: theatres[i].children[0].innerHTML,
      name: theatres[i].children[1].innerHTML
    });
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
      console.log('ei finnkino yhteyttä', error);
    });
  setDateOptions(generateNextWeekDates());
}, []);

const fetchSchedule = async (date, area) => {
  if (!area || !date) {
    console.log("area ei tullut taaskaan oikein");
    return;
  }

  try {
    
    const response = await fetch(`https://www.finnkino.fi/xml/Schedule/?area=${area}&dt=${date}`);
    const xmlText = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    const shows = xmlDoc.getElementsByTagName('Show');

    if (shows.length === 0) {
      console.log("ei näytöksiä");
    }

    const schedulesData = Array.from(shows).map((show) => {
      const title = show.getElementsByTagName('Title')[0]?.textContent;
      const eventTime = show.getElementsByTagName('dttmShowStart')[0]?.textContent;
      return { title, eventTime };
    });

    setSchedules(schedulesData);
    console.log(schedulesData); 
  } catch (error) {
    console.error("error", error);
  }
};

const handleAreaChange = (e) => {
  const area = e.target.value;
  setSelectedArea(area);  
};

const handleDateChange = (e) => {
  const date = e.target.value;
  setCurrentDate(date);  
  fetchSchedule(date, selectedArea); 
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
        {schedules.length > 0 ? (
          schedules.map((schedule, index) => (
            <div key={index}>
              <strong>{schedule.title}</strong> - {new Date(schedule.eventTime).toLocaleString()}
            </div>
          ))
        ) : (
          <p>Ei näytösaikoja</p>
        )}
      </div>
    </div>
    )
}






export default Finnkino;