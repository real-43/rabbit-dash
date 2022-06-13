import './App.css';
import ComDash from './Container/Fusion/fusion'
import Dash from './components/Dashboard'
import LoginPage from './Container/Login/login';
import SignupPage from './Container/Signup/signup';
import Header from './components/Header';
import Menu from './components/Menu';
import Footer from './components/Footer';
import {Router,Route,Routes} from 'react-router-dom';


function App() {
  
  return (
    <>
        <Header/>
        <Menu/>
        <Footer/>
        <Routes>
          <Route path="/dashboard" element={<Dash />}/>
          <Route path='/' exact element={<LoginPage />} />
          <Route path='/management/user' exact element={<SignupPage />} />
        </Routes>
    </>
  );
}

export default App;
