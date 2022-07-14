import { useState, useEffect } from 'react';
import { Route,Routes, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import './App.css';

import Footer from './components/Footer';
import Header from './components/Header';
import Menu from './components/Menu';
import Loading from './components/Loading';

// Main project
import Dash from './Container/Home/Dashboard'
import LoginPage from './Container/Login/login';
import SignupPage from './Container/Management/User/ManageUser';
import ManagePro from './Container/Management/Project/ManageProject';
import CreatePermissionAdmin from './Container/Management/Permission/Components/CreatePermissionAdmin';
import CreatePermissionOthers from './Container/Management/Permission/Components/CreatePermissionOthers';
import Permission from './Container/Management/Permission/PermissionForAdmin';
import PermissionForOthers from './Container/Management/Permission/PermissionForOthers';

// Rabbit SmartWatch
import Rabbit_SmartWatch_Search from './Container/Projects/Rabbit SmartWatch/Frontend/containers/Monitors/Smartwatch_Search'

// BTS QR
import BTS_QR_Home from './Container/Projects/BTSQR/Frontend/containers/Home';
import BTS_QR_Search from './Container/Projects/BTSQR/Frontend/containers/Monitors/Bts_Search'

// Datafile Monitoring
import DatafileHome from './Container/Projects/Datafile Monitoring/Frontend/Home';
import PDF from './Container/Projects/Datafile Monitoring/Frontend/PDF'

function App() {
  const taskR = useSelector((state) => state.firebase.task)
  const [task, setTask] = useState([...taskR] || []);

  useEffect(() => {
    setTask([...taskR])
  }, [taskR])

  const SidebarLayout = () => (
    <>
      <Header/>
      <Menu/>
      {(task.length > 0) ? (
        <div className='content-wrapper'>
          <Loading isLoading={true} />
        </div>
      ) : ""}
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

          <Route path='/Rabbit%20SmartWatchSearch' element={<Rabbit_SmartWatch_Search/>}  />
          <Route path='/Rabbit%20SmartWatchImport' element={<BTS_QR_Search/>} />            
        </Route>
      </Routes>
    </>

  );
}

export default App;
