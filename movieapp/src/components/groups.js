import { useState, useRef, useEffect } from 'react';
import React from 'react';
import axios from 'axios';

const Groups = () => {
    const [group, setGroup] = useState('')
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    



//tämä valmis

 
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

    useEffect(() => {
      fetchUserGroups(); 
  }, []);



/*
  const testi = async (requestId) => {
    try {
      const response = await axios.post('http://localhost:3001/api/groupstesti');
      
      console.log('testii', response.data);
    } catch (error) {
      console.error('ei testii', error);
    }
  };
*/

return (
<div className="groups container-sm">
    <h1 className="mb-3">Groups</h1>

<div className="groupList">
  {}
{loading}
{}
{error}
<ul className="list-group">
        {groups.map((group) => (
          <li className="list-group-item" key={group.group_id}>
            <strong>{group.name}</strong> 
          </li>
        ))}
      </ul>
    
</div>
</div>
)
}





export default Groups;