
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FavoritesList from './FavoritesList';
import TmdbDetails from './TmdbDetails';

const Profile = () => {
  const { userId } = useParams();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };
  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}`);
        if (!response.ok) {
          throw new Error('User not found');
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [userId]);
  if (!userInfo) {
    return <p>Loading user information...</p>;
  }

  const { email, favorite_list_id } = userInfo;

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      {userInfo ? (
        <>
          <p>Profile page of the user:{' '}<strong>{email}</strong></p>
        </>
      ) : ( <p>No information found</p> )}

      <FavoritesList userId={userId} onMovieClick={handleMovieClick} />

      {selectedMovie && (
        <div className="modal">
          <TmdbDetails 
            item={selectedMovie} 
            onClose={handleCloseDetails}
          />
        </div>
      )}
      <p>Share a link to your favorites list:</p>
      <a href={`http://localhost:3000/share/${favorite_list_id}`}>Click here to open</a>
    </div>
  );
};


export default Profile;