import { useState, useRef, useEffect } from 'react';
import React from 'react';
import axios from 'axios';

const Groups = () => {
    const [group, setGroup] = useState('')
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    



//groupid listaus
useEffect(() => {
  testi()
    const fetchUserGroups = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/groups2');
        setGroups(response.data); 
      } catch (err) {
        setError('Error fetching user groups');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroups();
  }, []);

  const testi = async (requestId) => {
    try {
      const response = await axios.post('http://localhost:3001/api/groupstesti');
      
      console.log('testii', response.data);
    } catch (error) {
      console.error('ei testii', error);
    }
  };


return (
<div className="groups">
    Groups

<div className="groupList">

<ul>
        {groups.map((group) => (
          <li key={group.group_id}>
            <strong>{group.name}</strong> (Created by User ID: {group.creator_user_id})
          </li>
        ))}
      </ul>
    
</div>
</div>
)
}





export default Groups;