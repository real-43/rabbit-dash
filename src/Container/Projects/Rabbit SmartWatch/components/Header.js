import React, { useState, useRef } from "react";
import Navbar from './component/Nav';
import logo from '../images/logoRabbits.jpg';
import { useHistory, useLocation } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { GoogleLogout } from 'react-google-login';
import { Burger, Menu } from '../components';
import { useOnClickOutside } from '../hooks';
import "../css/Header.css";

const Header = () => {
    const username = localStorage.getItem('Name')
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const node = useRef();
    useOnClickOutside(node, () => setOpen(false));

    const location = useLocation();
    const history = useHistory();

    const logout = () => {
        localStorage.clear();
        history.push('/');
    }

    return (
        <div className="container-fluid" style={{ background: 'white' }}>
            <div className="full-nav ">
                <div className="row">
                    <div className="img-box inline-block"><img src={logo} alt="" onClick={() => history.push('/smartwatch_search')} style={{ maxHeight: '100%', maxWidth: '100%', display: 'block' }} /></div>
                    <div className="d-flex align-items-center">
                        <Navbar pathname={location.pathname} />
                    </div>
                </div>
                <div className="ml-auto">
                    <button className="buttonA" onClick={(e) => setOpen2(!open2)}>{username ? username.substr(0, 1) : ''}</button>
                </div>

            </div>
            <div className="burger-nav" ref={node}>
                <Burger open={open} setOpen={setOpen} />
                <Menu open={open} setOpen={setOpen} pathname={location.pathname} />
                <button className="buttonA" onClick={(e) => setOpen2(!open2)}>{username ? username.substr(0, 1) : ''}</button>
                <div className="img-box mx-auto"><img src={logo} alt="" onClick={() => history.push('/home')} style={{ maxHeight: '100%', maxWidth: '100%', display: 'block' }} /></div>
            </div>
            <div className="accounts" style={{ display: open2 ? 'block' : 'none' }}>
                <div className="header">{username}</div>
                <GoogleLogout
                    clientId="239632812014-hkdqhseqll1uc2grtgkf22m5n7jf3438.apps.googleusercontent.com"
                    render={renderProps => (
                        <button className="dropdown-item" onClick={renderProps.onClick}>Logout</button>
                    )}
                    onLogoutSuccess={logout}
                >
                </GoogleLogout>
            </div>
        </div>
    );
}

export default Header;