import React from 'react';
import { Link } from 'react-router-dom';



function Navbar() {
    return (
      <nav>
        <ul className='navbar'>
          
          <li><Link to="/finnkino">Finnkino</Link></li>
          <li><Link to="/Reviews">Reviews</Link></li>
          <li><Link to="/Tmdb">Tmdb</Link></li>
          <li><Link to="/Groups">Groups</Link></li>
       
        </ul>
      </nav>
    );
  }
  
  export default Navbar;


