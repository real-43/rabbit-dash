// import "../css/DashboardLayoutRoute.css";
import { GoogleLogout } from 'react-google-login';
import { useHistory, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { useEffect, useState } from "react";
import { Route } from "react-router-dom"

const DashboardLayoutRoute = ({ children, ...rest }) => {
    const username = localStorage.getItem('Name')
    const location = useLocation();
    const history = useHistory();

    const logout = () => {
        localStorage.clear();
        history.push('/');
    }
    return (
        <div className="container-fluid">
            <Header />
            <div className="main_monitor">
                <div className="content_monitor">
                    {children}
                </div>
            </div>
            <div className="fixed-bottom text-center">
                version 0.1
            </div>
        </div>
    )
}

// const DashboardLayoutRoute = ({ component: Component, ...rest }) => {
//     return (
//       <Route
//         {...rest}
//         render={(props) => (
//           <DashboardLayout>
//             <Component {...props} />
//           </DashboardLayout>
//         )}
//       />
//     );
//   };

export default DashboardLayoutRoute;