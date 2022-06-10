import React, { Component } from 'react'
import './Header.css'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase';
import { useNavigate } from 'react-router';

export default function Header() {
  const router = useNavigate();
  const handleChange = () => {
      signOut(auth).then(() => {
        router('/login')
      console.log("signout");
      }).catch((error) => {
        router('/')
      });
  }
  return (
      <div>
      <nav className="main-header navbar navbar-expand navbar-color navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#"><i className="fas fa-bars" /></a>
          </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          {/* Notifications Dropdown Menu */}
          <li className="nav-item">
            <a className="nav-welcome">
              ยินดีต้อนรับคุณ : <strong>admin admin</strong>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-log" href="#" onClick={handleChange}>
              [ออกจากระบบ]
            </a>
          </li>
        </ul>
      </nav>
    </div>

  )

}
