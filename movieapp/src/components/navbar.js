import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';



function Navbar({ isAuthenticated }) {
    const auth = React.useContext(AuthContext);
    useEffect(() => {
      console.log('Navbar re-rendered. Auth state:', auth.auth);
    }, [auth]);
    return (
      <nav>
        <ul className='navbar'>
          
          <li><Link to="/finnkino">Finnkino</Link></li>
          <li><Link to="/Reviews">Reviews</Link></li>
          <li><Link to="/Tmdb">Tmdb</Link></li>
          <li><Link to="/Groups">Groups</Link></li>
          <li><Link to="/Account">Account</Link></li>

          {isAuthenticated ? ( <li><Link to="/LogOut">Log Out</Link></li>
          ) : ( <li><Link to="/LogIn">Log In</Link></li> )}
        </ul>
      </nav>
    );
  }
  
  export default Navbar;


