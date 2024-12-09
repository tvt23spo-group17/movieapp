import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UseUser';
import axios from '../axiosConfig';

function DeleteAccount() {
  const { user, signOut } = useUser();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();



  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await axios.delete('/delete-account', { data: { password } });
      signOut();
      navigate('/Login');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert(
        error.response?.data?.message ||
          'An error occurred while deleting your account.'
      );
    }
  };

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Confirm Password"
        required
      />
      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
}

export default DeleteAccount;