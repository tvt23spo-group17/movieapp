import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UseUser';

function LoginForm() {
  const { setUser, signIn } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="login-form container-sm mt-5">
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
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button className="btn btn-secondary" type="submit">Login</button>
      {message && <p>{message}</p>}
      </div>
    </form>
    </div>
  );
}

export default LoginForm;