import './App.css';
import Dash from './components/Dashboard'
import LoginPage from './Container/Login/login';
import SignupPage from './Container/Signup/signup';
import Header from './components/Header';
import Menu from './components/Menu';
import Footer from './components/Footer';
import {Route,Routes, Outlet} from 'react-router-dom';


function App() {

  const SidebarLayout = () => (
    <>
      <Header/>
      <Menu/>
      <Footer/>
      <Outlet/>
    </>
  );
  
  return (
    <>
        <Routes>
          <Route path='/' exact element={<LoginPage/>} />
          <Route element={<SidebarLayout/>}>
            <Route path='/dashboard' element={<Dash/>} />
            <Route path='/managementUser' element={<SignupPage/>} />
          </Route>
        </Routes>
    </>

  );
}

export default App;
