import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UseUser';
import './GroupPage.css';
import { useContext } from 'react';

const url = 'http://localhost:3001'

const GroupPage = () => {
  const { group_Id } = useParams(); 
const group_id = group_Id

  const [member, setMember] = useState('')
  const [members, setMembers] = useState([])
  //const [userId, setUserId] = useState();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUser();
    const user_id = user.userId; //user.userId
    const [groupMovie, setGroupMovie] = useState('')
    const [groupMovies, setGroupMovies] = useState([])
    const [selectedMovie, setSelectedMovie] = useState('');
    const [groupMovies2, setGroupMovies2] = useState([])
    const [groupMovie2, setGroupMovie2] = useState('')
    const [movieShowtimes, setMovieShowtimes] = useState([]);

  useEffect(() => {
   // console.log(group_Id, 'alku')
    
    updateMembers();

  }, []);



  
  const fetchMembers = async (group_id) => {
    try {
    
      const response = await axios.get(url + `/member/list/${group_id}`);
      setMembers(response.data);
      console.log(response)
      console.log("members update")
      setError(null);
    } catch (err) {
      setError('Error no connection');
      console.error(err);
    } finally {
      setLoading(false);
    }
    showListGroupPageMovie(group_id);
  };



  const updateMembers = async () => {
    try {
    
      for (const request of pendingRequests) {
        if (request.status === 'rejected') {
         //console.log()
          await axios.delete(url + `/member/${group_Id}/remove/${request.request_id}`);
          console.log(`Request ${request.request_id} rejected and deleted`);
        } else if (request.status === 'accepted') {
         await axios.post(url + `/member/${group_Id}/transfer/${request.request_id}`);
         console.log(`Request ${request.request_id} accepted and member added`);
        }
      }
      handleGroupPageMovie();
      fetchMembers(group_id);
    
      fetchPendingRequests();
    
    } catch (error) {
      console.error('Error updating member statuses:', error);
    }
  };


  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(url + `/member/${group_Id}/pendingRequests`);
      setPendingRequests(response.data); 
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

const rejectMember = async (requestId) => {
  try {
    const response = await axios.post(url + `/member/${group_Id}/reject/${requestId}`);
    setPendingRequests(pendingRequests.filter(req => req.request_id !== requestId));
    console.log('Request rejected:', response.data);
  } catch (error) {
    console.error('Error reject:', error);
  }
};


const addMember = async (requestId) => {
  try {
    
    const response = await axios.post(url + `/member/${group_Id}/accept/${requestId}`);
    setPendingRequests(pendingRequests.filter(req => req.request_id !== requestId));
    console.log('Join group:', response.data);
  } catch (error) {
    console.error('Error joining:', error);
  }

};
    


const deleteMember = (requestId) => {
 // console.log(requestId)
    axios.delete(url + '/member/' + requestId)
    .then(response => {
        const withoutRemoved = members.filter((item) => item.requestId !== requestId)
        setMembers(withoutRemoved)
    }).catch(error =>{
        alert(error.response.data.error ? error.response.data.error : error.message)
    })
   
}

const handleGroupPageMovie = (user) => {
  
//console.log(user_id)
//console.log("toimiiko lehvahaku")

axios.get(url + "/groupMember/movie_sched/", {
  params: { user_id: user_id }
} )
.then(response => {
  const newMovies = response.data.map(movie => ({
    local_title: movie.local_title,
    show_time: movie.show_time,
  }));

  setGroupMovies(prevGroupMovies => [...prevGroupMovies, ...newMovies]);
  setGroupMovie(''); 

})
}


const handleGroupMovieShow = () => {
 // console.log(group_id)

  if (!selectedMovie) {
    alert("Please select a movie first!");
    return;
  }
  const selectedMovieDetails = groupMovies.find(movie => movie.local_title === selectedMovie);
 
  axios.post(`http://localhost:3001/groupMember/movie_sched/`,{
    group_id: group_id,
    local_title: selectedMovieDetails.local_title,
    show_time: selectedMovieDetails.show_time,
  
  })
    .then(response => {
      setGroupMovies2(...groupMovies2, {id: response.data.groupMovie2.group_id, name: groupMovie2});
      setGroupMovie2('')
      })
  .catch(error =>{
      //  console.log(error.response)
        })
  }


const showListGroupPageMovie = async (group_id) => {
  console.log(group_id)
  console.log("updatee näytös")
  
    axios.get(url + `/groupMember/movie_sched2/${group_id}`, {
      //params: { group_id: group_id }
    } )
    .then(response => {
      console.log(response)
      const data = response.data;
      setMovieShowtimes(data);
      
    }).catch(error => {
      console.error("Error fetching movies for the group:", error);
    });
}








const leaveGroup = (group_id, creator_user_id, user_id) => {
        //const creator_user_id = group_id.creator_user_id
        console.log(user_id)
        console.log(creator_user_id)
 // console.log(group_id);
 if (user_id === creator_user_id) {
  alert('Owner cannot leave group');
  return; 
}
  axios.post(url + `/groupMember/${group_id}/leave`, {
    user_id: user_id
})
.then(response => {
    alert('Leave group'); //tämä varmaan pois kun törkeen näkönen
   
})
.catch(error => {
    alert(error.response?.data.error ? error.response.data.error : error.message);
});
} 

  return (
    <div className="Group-page">
      Add new members
      <div className="Memberlist"></div>
      <ul>
  <h3>Members</h3>
  {members.length > 0 ? (
    members.map((member) => (
      <li key={member.group_id}>
        <strong>{member.user_id}</strong>
      </li>
    ))
  ) : (
  <p></p>
  )}
</ul>

<ul>
  <h3>Pending Requests</h3>
  {pendingRequests.length > 0 ? (
    pendingRequests.map((request) => (
      <li key={request.request_id}>
        <p>{request.user_id} has requested to join the group</p>
        <button onClick={() => addMember(request.request_id)}>Add member</button>
        <button onClick={() => rejectMember(request.request_id)}>Decline member</button>
        
      </li>
    ))
  ) : (
    <p>No member requests.</p>
  )}
</ul>

<div className="groupMovies"></div>

<h4>Näytösaikoja</h4>

        <select value={selectedMovie}
        onChange={(e) => setSelectedMovie(e.target.value)}>
          <option value="">Valitse näytösaika</option>
          {groupMovies.length > 0 ? (
            groupMovies.map((groupMovie, index) => (
              <option
                key={groupMovie.local_title + groupMovie.show_time + index}
                value={groupMovie.local_title}
              >
                {groupMovie.local_title} ({groupMovie.show_time})
              </option>
            ))
          ) : (
            <option>No movies available</option>
          )}
        </select>
        <button onClick={handleGroupMovieShow}>Talleta näytösaika ryhmälle</button>
        <div>
        <ul>
        {movieShowtimes.length > 0 ? (
            movieShowtimes.map((movie, index) => (
              <li key={index}>
                {movie.local_title} - {new Date(movie.show_time).toLocaleString()}
              </li>
            ))
          ) : (
            <li>No movie showtimes available.</li>
          )}
        </ul>
        </div>

<ul>
<button onClick={() => leaveGroup(group_id)}>Leave Group</button>

</ul>


    </div>
  );
};

export default GroupPage;