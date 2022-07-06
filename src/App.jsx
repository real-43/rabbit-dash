import { useState, useEffect } from 'react';
import { Route,Routes, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import './App.css';

import Footer from './components/Footer';
import Header from './components/Header';
import Menu from './components/Menu';
import axios from "axios";
import Dash from './Container/Home/Dashboard'

import LoginPage from './Container/Login/login';

import SignupPage from './Container/Management/ManageUser';
import ManagePro from './Container/Management/ManageProject';
import CreatePermissionAdmin from './Container/Management/Permission/CreatePermissionAdmin';
import CreatePermissionOthers from './Container/Management/Permission/CreatePermissionOthers';
import Permission from './Container/Management/Permission/PermissionForAdmin';
import PermissionForOthers from './Container/Management/Permission/PermissionForOthers';
import BTS_QR_Home from './Container/Projects/BTSQR/containers/Home';
import BTS_QR_Search from './Container/Projects/BTSQR/containers/Monitors/Bts_Search'

import DatafileHome from './Container/Projects/Datafile Morniting/Home';
import PDF from './Container/Projects/Datafile Morniting/PDF'

import { storeFetchDataBTAQR } from './Reducer/firebaseSlice';

function App() {
  const dispatch = useDispatch();
  const taskR = useSelector((state) => state.firebase.task)
  const [task, setTask] = useState([...taskR] || []);

  const base_api = 'http://localhost:9000'

  useEffect(() => {
    setTask([...taskR])
  }, [taskR])

  useEffect(() => {
    const fetchData = async () => {
        let response = await axios({
            method: "get",
            url: `${base_api}/api/get_bss_stations`,
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'rabbit2020ok'
            }
        });
        let datas = response.data
        let arroptions = []
        datas.forEach(data => {
            arroptions.push({
                value: data.SP_BranchId,
                label: data.bss_loc_des
            })
        })
        dispatch(storeFetchDataBTAQR(arroptions))
    }
    fetchData();

}, [])

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
