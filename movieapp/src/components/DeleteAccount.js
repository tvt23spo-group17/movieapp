import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { AuthContext } from '../AuthContext';

function DeleteAccount() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const { setAuth } = useContext(AuthContext);

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete('/delete-account', { data: { password } });
      localStorage.removeItem('token');
      setAuth(false);
      navigate('/Login');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert(error.response?.data?.message || 'An error occurred while deleting your account.');
    }
  };

  return (
    <div>
      <h2>Account Settings</h2>
      <h3>Delete Account</h3>
      <div>
        <label>Please enter your password to confirm:</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button onClick={handleDeleteAccount}>
        Delete Account
      </button>
    </div>
  );
}

export default DeleteAccount;