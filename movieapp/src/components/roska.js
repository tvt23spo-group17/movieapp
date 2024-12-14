

/*
const addGroup = (user) => {
    axios.post(url + '/api/groups', {
        name: group,
        creator_user_id: user_id
    })
    .then(response => {
        const group_id = response.data.group.group_id;
        const creator_user_id = response.data.group.creator_user_id;
        setGroups([...groups, { id: group_id, name: group }]);
        setGroup('')
        axios.post(url + '/groupMember/', {
            group_id: group_id,
            user_id: creator_user_id
        })
        .then(response => {
            setOwners([...owners, { id: response.data.group_id.role, name: owner }]);
            setOwner('')
            console.log(response.data)
        })
        .catch(error => {
            console.log(error.response?.data.error ? error.response.data.error : error.message)
        });

        console.log(response);
    })
    .catch(error => {
        console.log(error.response?.data.error ? error.response.data.error : error.message)
    });
    fetchUserGroups(); 
};
*/


/*
const memberStatus = () => {
    
    
        axios.get(url + '/groupMember/status', {

          
        }).then(response => {
            const members = response.data.members;
            setMember(members);
            console.log(members);
        }).catch(error => {
            console.log(error.response?.data.error ? error.response.data.error : error.message)
        });
       
        
    
};
*/


/* tämä siirtyy sinne mistä elokuva aika tarkoitus siirtää groupPageen
const sendMovieGroup = async () => {
   
axios.post(url + `/groupMember/movie_sched/${user_id}`,{
      local_title: local_title,
      show_Time: show_Time
})
      .then(response => {
        setMovieSchedGroup()
        }).catch(error =>{
          console.log(error.response)
          })
        }

*/





