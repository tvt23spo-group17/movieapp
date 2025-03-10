import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Navbar from './components/navbar';
import Groups from './components/groups';
import Finnkino from './components/finnkino';
import './components/navbar.css';
import Reviews from './components/reviews';
import Tmdb from './components/tmdb';
import Logout from './components/LogOut';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Account from './components/Account';
import Register from './components/Register';
import GroupPage from './components/GroupPage';
import GroupManagement from './components/GroupManagement';
import Profile from './components/Profile';
import SharedFavorites from './components/SharedFavorites';


function App() {
 
  return (
      <Router>
        <Navbar />
        
        <Routes>
          <Route path="/Finnkino" element={<Finnkino />} />
          <Route path="/Reviews" element={<Reviews />} />
          <Route path="/Groups" element={<Groups />} />
          <Route path="/" element={<Tmdb />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Logout" element={<Logout />} />
          <Route path="/Profile/:userId" element={<Profile />} /> 
          <Route path="/share/:favorite_list_id" element={<SharedFavorites />} />
      
          <Route path="/GroupManagement" element={<PrivateRoute><GroupManagement /></PrivateRoute>} />      
          <Route path="/GroupManagement/:group_Id" element={<PrivateRoute><GroupPage /></PrivateRoute>} />
          <Route path="/Profile/:userId" element={<Profile />} /> 
          <Route path="/Account" element={<PrivateRoute><Account /></PrivateRoute>} />
        </Routes>
      </Router>
  );
}
export default App;