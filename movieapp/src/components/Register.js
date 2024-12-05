import React, { useState } from 'react';
import { useUser } from '../context/UseUser';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const { setUser, signUp } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      setMessage('Registration successful');
      navigate('/Login');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred.');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const errors = validatePassword(newPassword);
    setPasswordErrors(errors);
  };

  const validatePassword = (password) => {
    const errors = [];

    const minLength = /.{8,}/;
    if (!minLength.test(password)) {
      errors.push('Password must be at least 8 characters long.');
    }
    const hasUpperCase = /[A-Z]/;
    if (!hasUpperCase.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    const hasNumber = /\d/;
    if (!hasNumber.test(password)) {
      errors.push('Password must contain at least one number.');
    }
    return errors;
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setUser((prevUser) => ({ ...prevUser, email: e.target.value }));
        }}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={passwordErrors.length > 0}>Register</button>
      {passwordErrors.length > 0 && (
        <ul>
          {passwordErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      {message && <p>{message}</p>}
    </form>
  );
}

export default RegisterForm;