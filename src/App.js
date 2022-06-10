import './App.css';
import ComDash from './Container/Fusion/fusion'
import LoginPage from './Container/Login/login';
import {Router,Route,Routes} from 'react-router-dom';

function App() {
  
  return (
      <Routes>
        <Route path="/" element={<ComDash />}/>
        <Route path='/login' element={<LoginPage />} />
      </Routes>
  );
}

export default App;
