
import './App.css';
import { useEffect, useState, useRef, useContext } from 'react';
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
import LogOut from './components/LogOut';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Account from './components/Account';
import Register from './components/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);
  return (
    <Router>
       
       <Navbar isAuthenticated={isAuthenticated} />


       <Routes>
        <Route path="/Finnkino" element={<Finnkino />} />    
        <Route path="/Reviews" element={<Reviews />} />
        <Route path="/Groups" element={<Groups />} />
        <Route path="/Tmdb" element={<Tmdb />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/LogOut" element={<LogOut setIsAuthenticated={setIsAuthenticated} />} />
        <Route 
        path="/Account" element={
          <PrivateRoute>
            <Account />
          </PrivateRoute>
          } />
       </Routes>
      
    </Router>
  );
}


export default App;
