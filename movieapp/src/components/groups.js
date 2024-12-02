import { useState, useRef } from 'react';
import React from 'react';

const Groups = () => {
    const [group, setGroup] = useState('')
    const [groups, setGroups] = useState([])

const addGroup = () => {
    setGroups([...groups,group])
    setGroup('')
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

</ul>

</div>
</div>
)
}





export default Groups;