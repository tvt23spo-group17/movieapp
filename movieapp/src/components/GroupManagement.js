import { useState, useRef, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UseUser';
import { useContext } from 'react';


const url = 'http://localhost:3001'

const GroupManagement = () => {
    const [group, setGroup] = useState("")
    const [groups, setGroups] = useState([])
    //const [userId, setUserId] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   
    const { user } = useUser();
    const user_id = user.userId; //user.userId



useEffect(() => {
    fetchUserGroups(); 
    console.log(user_id)
    

}, []);
   
//ryhmien haku ja userId tarkastus onko owner vai ei



const fetchUserGroups = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/groups2');
      setGroups(response.data);
      setError(null);
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
  
}
const deleteGroup = (group_id) => {
    axios.delete(url + '/api/groups/' + group_id)
    .then(response => {
        const withoutRemoved = groups.filter((item) => item.group_id !== group_id)
        setGroups(withoutRemoved)
    }).catch(error =>{
        alert(error.response.data.error ? error.response.data.error : error.message)
    })
   
}

const sendJoinRequest = (user) => {
    console.log(user_id)
    axios.post(url + `/groupMember/${user_id}/join`, {
        user_id: user_id
        
    })
    .then(response => {
        alert('Request sent'); //tämä varmaan pois kun törkeen näkönen
       
    })
    .catch(error => {
        alert(error.response?.data.error ? error.response.data.error : error.message);
    });
};


return (
<div className="groups">
    Groups

<div className="groupList">
<form>
<input
placeholder='Add new group'
value={group}
onChange={e => setGroup(e.target.value)}
onKeyDown={e =>{
    if (e.key === 'Enter') {
        e.preventDefault()
        addGroup()
    }
}}
/>
</form>
<ul>
{groups.map(item => (
                        <li key={item.id}>
                            <Link to={`${item.group_id}`}>{item.name}</Link>

                            {}
                            {user_id === item.creator_user_id ? (
                                <button className="delete-button" onClick={() => deleteGroup(item.group_id)}>
                                    Delete
                                </button>
                            ) : (
                                <button className="join-button" onClick={() => sendJoinRequest(item.group_id)}>
                                    Send Join Request
                                </button>
                            )}
                        </li>
                    ))}
</ul>

</div>
</div>
)
}





export default GroupManagement;