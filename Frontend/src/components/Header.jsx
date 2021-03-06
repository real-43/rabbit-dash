import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import './Header.css'
import { signOut } from 'firebase/auth'
import { auth, db } from '../Firebase Config/firebase';
import { useDispatch } from 'react-redux';
import { defindCurrentRoleFS, defindCurrentUser, defindCurrentUserFS, deleteAll, popTask } from '../Reducer/firebaseSlice';
import { useSelector } from 'react-redux';
import { collection, onSnapshot, doc, query, where, getDocs, getDoc } from "firebase/firestore";
import { defindAllProjects, defindAllRoles, defindAllUsers } from "../Reducer/firebaseSlice";

export default function Header() {

  const router = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.firebase.currentUser) || auth.currentUser || {email: ""};
  const userName = user.displayName || user.email.split('@')[0]
  const [isData, setIsData] = useState(false)
  const [pass, setPass] = useState(0)
  const taskR = useSelector((state) => state.firebase.task)
  const [task, setTask] = useState([...taskR]);

  const handleChange = () => {
    signOut(auth).then(() => {
      dispatch(deleteAll())
      router('/')
    }).catch((error) => {
      router('/dashboard')
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      defindAll()
    }, 60000 );

    return () => clearInterval(interval)
  })

  useEffect(() => {
    setTask([...taskR])
  }, [taskR])

  const defindAll = () => {
    setIsData(true)
    onSnapshot(collection(db,"users"),(function(querySnapshot) {
      
      let users = [];
      querySnapshot.forEach(function(doc) {
        users.push({...doc.data(), id: doc.id});
      });
      
      dispatch(defindAllUsers(users))
      if (task.length > 0) {
        dispatch(popTask("user"))
      }
    }));

    onSnapshot(collection(db,"roles"),(function(querySnapshot) {
      let roles = [];
      querySnapshot.forEach(function(doc) {
        roles.push({...doc.data(), id: doc.id});
      });
      if (task.length > 0) {
        dispatch(popTask("role"))
      }
      dispatch(defindAllRoles(roles))
    }));

    onSnapshot(collection(db,"projects"),(function(querySnapshot) {
      let projects = [];
      querySnapshot.forEach(function(doc) {
        projects.push({...doc.data(), id: doc.id});
      });
      if (task.length > 0) {
        dispatch(popTask("project"))
      }
      dispatch(defindAllProjects(projects))
    }));
  }

  const setC_UserAndRole_FS = async () => {
    let id = user.uid
    const docRef = doc(db, "users", id)
    const docSnap = await getDoc(docRef)
    const u = docSnap.data()
    dispatch(defindCurrentUserFS({...u, id: id}))

    let role = {}
    const q = query(collection(db, "roles"), where("name", "==", u.role));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      role = {...doc.data(), id: doc.id};
    });
    dispatch(defindCurrentRoleFS(role))
  }

  if (user.email !== "" && pass === 0) {
    setPass(1)
    dispatch(defindCurrentUser(user))
  }

  if (user.uid !== undefined && pass === 1) {
    setPass(2)
    setC_UserAndRole_FS()
  }

  if (!isData) {
    defindAll()
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
              ????????????????????????????????????????????? : <strong>{userName}</strong>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-log" href="#" onClick={handleChange}>
              [??????????????????????????????]
            </a>
          </li>
        </ul>
      </nav>
    </div>

  )

}
