import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UseUser';

function Navbar() {
  const { user } = useUser();

  useEffect(() => {
    console.log('Navbar re-rendered. User state:', user);
  }, [user]);

  const isAuthenticated = !!user.accessToken;

  return (
    <nav>
        <ul className='navbar'>
          
          <li><Link to="/finnkino">Finnkino</Link></li>
          <li><Link to="/Reviews">Reviews</Link></li>
          <li><Link to="/Tmdb">Tmdb</Link></li>
          <li><Link to="/Groups">Groups</Link></li>
          
          </ul>

          <ul className='navbar-right'>

          {isAuthenticated ? ( <li><Link to="/LogOut">Log Out</Link></li>
          ) : ( <li><Link to="/LogIn">Log In</Link></li> )}
          <li><Link to="/Register">Register</Link></li>
          <li><Link to="/Account">Account</Link></li>
          <li><Link to="/Profile">Profile</Link></li>
          <li><Link to="/GroupManagement">Group Management</Link></li>
        </ul>
      </nav>
  );
}

export default Navbar;


