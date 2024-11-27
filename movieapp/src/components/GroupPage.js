import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UseUser';

const url = 'http://localhost:3001'

const GroupPage = () => {
  const { id } = useParams(); 


  const [member, setMember] = useState('')
  const [members, setMembers] = useState([])
  const [userId, setUserId] = useState();
  const [pendingRequests, setPendingRequests] = useState([]);
//tämäkin täytyy olla sisäänkirjautumisen takana

//id täytyy muuttaa groupId kun haluaaa ottaa backendiin yhteyttä
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(url + `/api/member/${id}/pendingRequests`);
        setPendingRequests(response.data); 
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchPendingRequests();
  }, [id]);

const handleReject = async (requestId) => {
  try {
    const response = await axios.post(url + `/api/member/${id}/reject/${requestId}`);
    setPendingRequests(pendingRequests.filter(req => req.request_id !== requestId));
    console.log('Request rejected:', response.data);
  } catch (error) {
    console.error('Error reject:', error);
  }
};


const addMember = async (requestId) => {
  try {
    const response = await axios.post(url + `/api/member/${id}/accept/${requestId}`);
    setPendingRequests(pendingRequests.filter(req => req.request_id !== requestId));
    console.log('Join group:', response.data);
  } catch (error) {
    console.error('Error joining:', error);
  }
};
    


const deleteMember = (requestId) => {
    axios.delete(url + '/api/member/' + requestId)
    .then(response => {
        const withoutRemoved = members.filter((item) => item.requestId !== requestId)
        setMembers(withoutRemoved)
    }).catch(error =>{
        alert(error.response.data.error ? error.response.data.error : error.message)
    })
   
}


  return (
    <div className="Group-page">
      Add new members
      <div className="Memberlist"></div>
      {pendingRequests.length > 0 ? (
        <ul>
          {pendingRequests.map((request) => (
            <li key={request.request_id}>
              <p>{request.username} has requested to join the group</p>
              <button onClick={() => addMember(request.request_id)}>Add member</button>
              <button onClick={() => handleReject(request.request_id)}>Decline member</button>
              <button onClick={() => deleteMember(request.request_id)}>Delete member</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending requests.</p>
      )}
    </div>
  );
};

export default GroupPage;