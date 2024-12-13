import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UseUser';

function Navbar() {
  const { user } = useUser();

  const isAuthenticated = user && !!user.accessToken;

  return (
    <nav className='navbar navbar-expand-lg mb-3' data-bs-theme='dark'>
      <div className='container-sm'>
        <Link to="/" className='navbar-brand'>MovieApp</Link>
        <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav' aria-controls='navbarNav' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse' id='navbarNav'>
        <ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
          <li className='nav-item'><Link className='nav-link' to="/finnkino">Finnkino</Link></li>
          <li className='nav-item'><Link className='nav-link' to="/Reviews">Reviews</Link></li>
          <li className='nav-item'><Link className='nav-link' to="/">Movies</Link></li>
          <li className='nav-item'><Link className='nav-link' to="/Groups">Groups</Link></li>
          {isAuthenticated ? (
          <>
            <li className='nav-item'><Link className='nav-link' to={`/Profile/${user?.userId || ''}`}>Profile</Link></li>
            <li className='nav-item'><Link className='nav-link' to="/LogOut">Log Out</Link></li>
            <li className='nav-item'><Link className='nav-link' to="/Account">Account</Link></li>
            <li className='nav-item'><Link className='nav-link' to="/GroupManagement">Group Management</Link></li>
          </> ) : (
            <><li className='nav-item'><Link className='nav-link' to="/LogIn">Log In</Link></li><li className='nav-item'><Link className='nav-link' to="/Register">Register</Link></li></>
          )}
        </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


