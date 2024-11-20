import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/Register';
import LoginForm from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import LogOut from './components/LogOut';
import DeleteAccount from './components/DeleteAccount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <LogOut />
              <Dashboard />
              <DeleteAccount />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;