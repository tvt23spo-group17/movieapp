import { useState, useRef, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UseUser';
import { useContext } from 'react';


const url = 'http://localhost:3001'

const GroupManagement = () => {
    const [group, setGroup] = useState("")
    const [groups, setGroups] = useState([])
    //const [userId, setUserId] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [owner, setOwner] = useState("");
    const [owners, setOwners] = useState([]);
    const [members, setMembers] = useState([])
    const [member, setMember] = useState("")
    const navigate = useNavigate();
    const { user } = useUser();
    const [joinRequestSent, setJoinRequestSent] = useState({});

    const user_id = user.userId; //user.userId



useEffect(() => {
  
    fetchUserGroups(); 
   //console.log()
  
}, []);
   




const fetchUserGroups = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/groups2');
      setGroups(response.data);
      setError(null);
     // console.log(response.data)
    } catch (err) {
      setError('Error no connection');
      console.error(err);
    } finally {
      setLoading(false);
     
    
    }
  };



  const addGroup = (user) => {
    
    axios.post(url + '/api/groups', {
        name: group,
        creator_user_id: user_id
    })
    .then(response =>{
        setGroups([...groups, { id: response.data.group.group_id, name: group }]);
        setGroup('')
    }).catch(error =>{
        alert(error.response?.data.error ? error.response.data.error : error.message)
    })
    fetchUserGroups(); 
}




const handleGroupClick = async (group_id) => {
    try {
        console.log(user_id)

      const response = await axios.get(url + `/groupMember/${group_id}/members/${user_id}`);
      if (response.data.isMember || response.data.isOwner) {
        navigate(`/GroupManagement/${group_id}`);
      } else {
        alert('Access denied');
      }
    } catch (error) {
      alert('Access denied.');
    }
  };

const deleteGroup = (group_id) => {
    axios.delete(url + '/api/groups/' + group_id)
    .then(response => {
        const withoutRemoved = groups.filter((item) => item.group_id !== group_id)
        setGroups(withoutRemoved)
    }).catch(error =>{
        alert(error.response.data.error ? error.response.data.error : error.message)
    })
   
}

const sendJoinRequest = (group_id) => {
    if (joinRequestSent[group_id]) {
        alert("You have already sent a join request for this group.");
        return;
    }

    axios.post(url + `/groupMember/${group_id}/join/`, {
        user_id: user_id,
        group_id: group_id
    })
    .then(response => {
        setJoinRequestSent(prevState => ({
            ...prevState,
            [group_id]: true
        }));
        alert('Join request sent successfully!');
    })
    .catch(error => {
        alert(error.response?.data.error ? error.response.data.error : error.message);
    });
}
  

return (
    <div className="groups">
      <h2>Groups</h2>
      <div className="groupList">
        <form>
          <input
            placeholder="Add new group"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addGroup();
              }
            }}
          />
        </form>
        <ul>
        {groups.map(item => {
    console.log(item); 
    const requestSent = joinRequestSent[item.id];
    return (
      <li key={item.id}>
        <Link 
          to="#"
          onClick={(e) => {
            e.preventDefault();
            handleGroupClick(item.group_id); 
          }}
        >
          {item.name}
        </Link>
        {user_id === item.creator_user_id ? (
          <button className="delete-button" onClick={() => deleteGroup(item.id)}>
            Delete
          </button>
        ) : requestSent ? (
            
            <button disabled>
              Join Request Sent
            </button>
          ) :(
              (
              <button className="join-button" onClick={() => sendJoinRequest(item.id)}>
                Join Group
              </button>
          )
        )}
      </li>
    );
  })}
        </ul>
      </div>
    </div>
  );
}





export default GroupManagement;