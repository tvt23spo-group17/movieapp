import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UseUser';

function PrivateRoute({ children }) {
  const { user } = useUser();

  return user.accessToken ? children : <Navigate to="/Login" />;
}

export default PrivateRoute;