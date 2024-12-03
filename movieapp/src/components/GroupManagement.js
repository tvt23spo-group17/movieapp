import { useState, useRef, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const url = 'http://localhost:3001'

const GroupManagement = () => {
    const [group, setGroup] = useState("")
    const [groups, setGroups] = useState([])
    const [userId, setUserId] = useState(1);


//userID tarvitaan login puolelta
useEffect = () =>{
   

}


const addGroup = () => {
    axios.post(url + '/api/groups', {
        name: group,
        creator_user_id: userId
    })
    .then(response =>{
        setGroups([...groups, { id: response.data.group.group_id, name: group }]);
        setGroup('')
    }).catch(error =>{
        alert(error.response?.data.error ? error.response.data.error : error.message)
    })
  
}
const deleteGroup = (id) => {
    axios.delete(url + '/api/groups/' + id)
    .then(response => {
        const withoutRemoved = groups.filter((item) => item.id !== id)
        setGroups(withoutRemoved)
    }).catch(error =>{
        alert(error.response.data.error ? error.response.data.error : error.message)
    })
   
}



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
            <Link to={`/group/${item.id}`}>{item.name}</Link>
            <button className="delete-button" onClick={() => deleteGroup(item.id)}>Delete</button>
          </li>
        ))}
</ul>

</div>
</div>
)
}





export default GroupManagement;