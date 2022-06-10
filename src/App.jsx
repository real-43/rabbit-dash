import './App.css';
import Header from './components/Header';
import Menu from './components/Menu';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import LoginPage from './Container/Login/login';
import {Router,Route,Routes} from 'react-router-dom';

function App() {
  const DashWindow = 
  <div class="wrapper">
    <Header/>
    <Menu/>
    <Dashboard/>
    <Footer/>
  </div>
  return (
    
      <Routes>
        <Route path="/" element={DashWindow}/>
        <Route path='/login' element={<LoginPage />} />
      </Routes>
  );
}

export default App;
