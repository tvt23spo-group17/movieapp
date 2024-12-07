// UserProvider.js
import { useState } from 'react';
import { UserContext } from './UserContext';
import axios from '../axiosConfig';

const url = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function UserProvider({ children }) {
  const userFromSessionStorage = sessionStorage.getItem('user');
  const [user, setUser] = useState(
    userFromSessionStorage
      ? JSON.parse(userFromSessionStorage)
      : null
  );

  const signUp = async (email, password) => {
    try {
      await axios.post(`${url}/register`, { email, password });
      setUser(null);
    } catch (error) {
      console.error('signUp error:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await axios.post(`${url}/login`, { email, password });
      const { accessToken, refreshToken, user: userData } = response.data;
      const newUser = {
        email,
        accessToken,
        refreshToken,
        userId: userData.id,
      };
      setUser(newUser);
      sessionStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await axios.post(`${url}/logout`, { token: user.refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    sessionStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, setUser, signUp, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
}