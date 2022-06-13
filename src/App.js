import './App.css';
import ComDash from './Container/Fusion/fusion'
import LoginPage from './Container/Login/login';
import SignPage from './Container/Signup/signup'
import {Router,Route,Routes} from 'react-router-dom';

function App() {
  
  return (
      <Routes>
        <Route path="/dashboard" element={<ComDash />}/>
        <Route path='/' exact element={<LoginPage />} />
        <Route path='/management/user' exact element={<SignPage />} />
      </Routes>
  );
}

export default App;
