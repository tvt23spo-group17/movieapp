import { useParams } from 'react-router-dom';

const GroupPage = () => {
  const { id } = useParams(); 
//tänne jäsenten lisääminen
  
  return (
    <div>
      <h2>Group {id}</h2>
      {}
    </div>
  );
};

export default GroupPage;