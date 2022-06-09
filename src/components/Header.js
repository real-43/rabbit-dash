import React, { Component } from 'react'
import './Header.css'

export default class Header extends Component {
    render() {
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
        <a className="nav-log" href="#">
          [ออกจากระบบ]
        </a>
      </li>
    </ul>
  </nav>
</div>

        )
    }
}
