import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function LogOut({ setIsAuthenticated }) {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    setAuth(false);
    setIsAuthenticated(false);
    navigate('/Login');
  }, [setAuth, setIsAuthenticated, navigate]);

  useEffect(() => {
    console.log('Auth state is:', auth);
  }, [auth]);

  return null;
}

export default LogOut;