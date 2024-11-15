import './App.css';
import React, { useEffect, useState } from 'react';



function App() {

  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
    try {
    const response = await fetch('https://www.finnkino.fi/xml/Schedule/?area=1018'); //oulu valittu teatteriksi
    const xmlText = await response.text(); 
   const parser = new DOMParser();
   const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    const shows = xmlDoc.getElementsByTagName('Show');
    const schedulesData = Array.from(shows).map((show) => {
   const title = show.getElementsByTagName('Title')[0]?.textContent; //lehvan nimi
    const eventTime = show.getElementsByTagName('dttmShowStart')[0]?.textContent; //näytöksen alku
   return { title, eventTime };
    });
   setSchedules(schedulesData);
    console.log(schedulesData)
    } catch (error) {
    console.error('error', error);
    }
    };
    fetchSchedule();
  }, []);



  return (
   <div>
<h1>Finnkino Oulu lehvat</h1>
  <ul>
{schedules.length > 0 ? (
schedules.map((schedules, index) => (
<li key={index}>
<p>{schedules.title}</p> - {new Date(schedules.eventTime).toLocaleString()}
 </li>
  ))
  ) : (
  <li></li>
 )}
   </ul>
 </div>
  );
}

export default App;
