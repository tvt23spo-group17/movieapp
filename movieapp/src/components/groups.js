import { useState, useRef } from 'react';
import React from 'react';

const Groups = () => {
    const [group, setGroup] = useState('')
    const [groups, setGroups] = useState([])

const addGroup = () => {
    setGroups([...groups,group])
    setGroup('')
}
const deleteGroup = (deleted) => {
    const withoutRemoved = groups.filter((item) => item !== deleted)
    setGroups(withoutRemoved)
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
{
groups.map(item => (
    <li>{item}
    <button classname='delete-button' onClick={() => deleteGroup(item)}>Delete</button>
    </li>
))
}
</ul>

</div>
</div>
)
}





export default Groups;