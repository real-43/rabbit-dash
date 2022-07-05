import { useState, useEffect } from 'react';
import './App.css';
import Dash from './components/Dashboard'
import LoginPage from './Container/Login/login';
import SignupPage from './Container/Management/ManageUser';
import ManagePro from './Container/Management/ManageProject';
import Header from './components/Header';
import Menu from './components/Menu';

import BTS_QR_Home from './Container/Projects/BTSQR/containers/Home';
import BTS_QR_Search from './Container/Projects/BTSQR/containers/Monitors/Bts_Search'

import Footer from './components/Footer';
import {Route,Routes, Outlet} from 'react-router-dom';
import DatafileHome from './Container/Projects/Datafile Morniting/Home';
import PDF from './Container/Projects/Datafile Morniting/PDF'
import CreatePermissionAdmin from './Container/Management/Permission/CreatePermissionAdmin';
import CreatePermissionOthers from './Container/Management/Permission/CreatePermissionOthers';
import Permission from './Container/Management/Permission/PermissionForAdmin';
import PermissionForOthers from './Container/Management/Permission/PermissionForOthers';
import { useSelector } from 'react-redux'

function App() {

  const taskR = useSelector((state) => state.firebase.task)
  const [task, setTask] = useState([...taskR]);

  useEffect(() => {
    setTask([...taskR])
  }, [taskR])

  const SidebarLayout = () => (
    <>
      <Header/>
      <Menu/>
      {(task.length > 0) ? (<div>Popup Notifications</div>) : ""}
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
          <Route path='/managementProject' element={<ManagePro/>} /> 

          <Route path='/permission' element={<Permission/>} />
          <Route path='/permissionOthers' element={<PermissionForOthers/>}/>

          <Route path='/CreatePermissionAdmin' element={<CreatePermissionAdmin/>}/>
          <Route path='/CreatePermissionOthers' element={<CreatePermissionOthers/>} />

          <Route path='/Datafile%20MonitoringHome' element={<DatafileHome/>}  />
          <Route path='/Datafile%20MonitoringPDF' element={<PDF/>}  />

          <Route path='/BTS%20QRHome' element={<BTS_QR_Home/>}  />
          <Route path='/BTS%20QRBTS' element={<BTS_QR_Search/>} />  

         
          
        </Route>
      </Routes>
    </>

  );
}

export default App;
