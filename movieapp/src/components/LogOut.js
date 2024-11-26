import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UseUser';

function Logout() {
  const { signOut } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    signOut();
    navigate('/Login');
  }, [signOut, navigate]);

  return null;
}

export default Logout;