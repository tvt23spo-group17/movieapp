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
    <div className="register-form container-sm mt-5">
    <form onSubmit={handleSubmit}>
      <div className="input-group">
      <input
        className="form-control"
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
        className="form-control"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
        required
      />
      <button className="btn btn-secondary" type="submit" disabled={passwordErrors.length > 0}>Register</button>
      </div>
    </form>
    {passwordErrors.length > 0 && (
        <ul className="list-group mt-3">
          {passwordErrors.map((error, index) => (
            <li className="list-group-item" key={index}>{error}</li>
          ))}
        </ul>
      )}
    {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterForm;