
import './App.css';
import { useEffect, useState, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes, Route,
  Link
} from 'react-router-dom';
import Navbar from './components/navbar';
import Groups from './components/groups';
import Finnkino from './components/finnkino';
import './components/navbar.css';
import Reviews from './components/reviews';
import Tmdb from './components/tmdb';

function App() {

  return (
    <Router>
  
       
       <Navbar />


       <Routes>
       <Route path="/Finnkino" element={<Finnkino />} />    
       <Route path="/Reviews" element={<Reviews />} />
       <Route path="/Groups" element={<Groups />} />
       <Route path="/Tmdb" element={<Tmdb />} />
       </Routes>
      
    </Router>
  );
}


export default App;
