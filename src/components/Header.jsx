import React from 'react'
import { useNavigate } from 'react-router'
import './Header.css'
import { deleteUser, signOut } from 'firebase/auth'
import { auth } from '../firebase';
import { useDispatch } from 'react-redux';
import { defindCurrentUser, deleteCurrentUser } from '../firebaseSlice';
import { useSelector } from 'react-redux';

export default function Header() {

  const router = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.firebase.currentUser) || auth.currentUser || {email: ""};
  const userName = user.displayName || user.email.split('@')[0]

  const handleChange = () => {
    signOut(auth).then(() => {
      dispatch(deleteCurrentUser())
      router('/')
      console.log("signout");
    }).catch((error) => {
      router('/dashboard')
    });
  }

  if (user.email !== "") {
    dispatch(defindCurrentUser(user))
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
              ยินดีต้อนรับคุณ : <strong>{userName}</strong>
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
