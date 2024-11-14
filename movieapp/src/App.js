
import './App.css';
import { useEffect, useState } from 'react';


function App() {
 const [areas, setAreas] = useState([]);
  const getTheatres = (xml) => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml,'application/xml')
    const root = xmlDoc.children
const theatres = root[0].children
const tempAreas = []
    for (let i = 0;i <theatres.length;i++) {
     // console.log(theatres[i].children[1].innerHTML)
      tempAreas.push(
        {"id": theatres[i].children[0].innerHTML,
        "name": theatres[i].children[1].innerHTML
      }
      )
    }
    setAreas(tempAreas);
    console.log(tempAreas)
  }


  useEffect(() => {
    fetch('https://www.finnkino.fi/xml/TheatreAreas/')
    .then(response => response.text())
    .then(xml => {
      getTheatres(xml)
    })
     .catch(error => {
      console.log(error)
     })
    }, [])



  return (
    <div>
      <h1>finnkino Teatterit</h1>
    <select>
    {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}
          </option>
        ))}
    </select>
    <select>

    </select>
    </div>
  );
}

export default App;
