import { useState, useRef } from 'react';
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const url = 'http://localhost:3001'

const GroupManagement = () => {
    const [group, setGroup] = useState('')
    const [groups, setGroups] = useState([])

const addGroup = () => {
    axios.post(url + '/create', {
        name: group
    })
    .then(response =>{
        setGroups([...groups,{id: response.data.id,name: group}])
        setGroup('')
    }).catch(error =>{
        alert(error.response.data.error ? error.response.data.error : error)
    })
  
}
const deleteGroup = (id) => {
    axios.delete(url + '/delete/' + id)
    .then(response => {
        const withoutRemoved = groups.filter((item) => item.id !== id)
        setGroups(withoutRemoved)
    }).catch(error =>{
        alert(error.response.data.error ? error.response.data.error : error)
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