import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';


const LogOut = () => {
    const { setAuth } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogOut = () => {
        setAuth(false);
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <button className="logout-button" onClick={handleLogOut}>
            Log Out
        </button>
    );
};

export default LogOut;