import React, { useEffect, useRef, useState } from 'react'
import {  createUserWithEmailAndPassword, sendEmailVerification, updateProfile, onAuthStateChanged, deleteUser, updatePassword, signInWithEmailAndPassword } from "firebase/auth";
import { authSec, db } from '../../firebaseSec'
import { auth } from '../../firebase'
import { useNavigate } from 'react-router'
import Loader from './CircleLoader'
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import './signup.css'

// const theme = createTheme();
// const user = auth.currentUser;

export default function Signup() {

  const [userInfo, setUserInfo] = useState({ userName: '', email: '', password: '' });
  const [alert, setAlert] = useState({visible:false, severity:'', message:''});
  const [isOpen, setIsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("")
  const [newName, setNewName] = useState("")
  const [changeUser, setChangeUser] = useState()
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const router = useNavigate();
  const timerRef = useRef(null);

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(usersCollectionRef, { userName: userInfo.userName, email: userInfo.email, password: userInfo.password });
    window.location.reload(false);
    setIsLoading1(false);
  };

  const deleteUserOnFstored = async (user) => {
    setIsLoading2(true);
    const userDoc = doc(db, "users", user.id);
    await deleteDoc(userDoc);

    await signInWithEmailAndPassword(authSec, user.email, user.password)
      .then(() => {
        const userToDel = authSec.currentUser
        deleteUser(userToDel)
        authSec.signOut()
      })
    
    window.location.reload(false);
    setIsLoading2(false);
    };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  useEffect(() => {
    return clearTimeout(timerRef.current)
  },[])
  
  useEffect(() => {
      const authentication = onAuthStateChanged(auth,(user) => {
          if (user) {
              router('/managementUser')
          } else {
              router('/')
         }
      }) 
      
      return authentication
  },[])

  // Change Name or Password in firebase
  const handleChange = async (user) => {

    // Change in firestore
    const userDoc = doc(db, "users", user.id);
    if (newName !== "") {
      updateDoc(userDoc, {
        "userName": newName
      });
    }

    if (newPassword !== "") {
      updateDoc(userDoc, {
        "password": newPassword
      });
    }

    // Change in firebase auth
    await signInWithEmailAndPassword(authSec, user.email, user.password)
    .then(() => {
      const userToChange = authSec.currentUser
      console.log("asdddddddddddddddddddddddddddddddddddddddddddddddd",userToChange);
      
      if(newName !== "") {
        updateProfile(userToChange, {
          displayName: newName
        })
      }

      if(newPassword !== "") {
        updatePassword(userToChange, newPassword)
      }

      authSec.signOut()
    }) 
  }

  // To create new user in firebase
  const handleSubmit = (event) => {
    setIsLoading1(true);
    event.preventDefault();
    
    // Create user in firebase auth
    createUserWithEmailAndPassword(authSec, userInfo.email, userInfo.password)
      .then((userInformation) => {
        updateProfile(authSec.currentUser, {
          displayName:userInfo.userName
        })
        createUser(); // To create user in firestore
        sendEmailVerification(authSec.currentUser)
        console.log(userInformation, userInformation.user);
        
        router('/managementUser')
      })
      .catch(error => {
        setAlert({ visible:true,severity:'error',message:error.message})
        console.log(error.code);
        timerRef.current= setTimeout(() => {
          setAlert({ visible:false,severity:'',message:''})
        },2000)
    })
    
  };

  // To open/close popup and set user that send form edit btn
  function changeSet(user) {
    setChangeUser(user)
    setIsOpen(!isOpen)
  }

  // Popup input to chnage password or name
  function popup() {
    return (isOpen) ? (
      <div>
        <button onClick={(e) => setIsOpen(!isOpen)}> X </button>
        <input
          type="text"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter New Password"
        />
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter New Name"
        />
        <button onClick={(e) =>{handleChange(changeUser)}}>Click</button>
      </div>
    ) : "";
  }

   return (
    <div className="content-wrapper">
      <h3>Management {'>'} User</h3>
      {isLoading1 ? (
            <Loader style={{marginLeft:"auto", maginRight:"auto"}}/>
          ) : (
      <div className='input-wrapper'>
        <h4>Create New User</h4>

        <div className='input-container'>
          <input className='input-register'
            placeholder="Name..."
            onChange={(event) => {
              setUserInfo({ ...userInfo, userName: event.target.value })
            }}
          />
          <input className='input-register'
            type="Email"
            placeholder="Email..."
            onChange={(event) => {
              setUserInfo({ ...userInfo, email: event.target.value })
            }}
          />
          <input className='input-register'
            type="Password"
            placeholder="Password..."
            onChange={(event) => {
              setUserInfo({ ...userInfo, password: event.target.value })
            }}
          />
          
            <button className="btn" onClick={handleSubmit}> Create User</button>
          
        </div>
      </div>
      )}
      {popup()}
      <div className='table-container'>
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Email</th>
              <th>function</th>
            </tr>
          </thead>
          {users.map((user) => {return (
          <tbody>
            <tr>
              <td>1</td>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td className='btn-table'> 
                {isLoading2 ? (
                      <Loader />
                    ) : (
                      <button
                        className='btn-function btn'
                        onClick={() => {
                          deleteUserOnFstored(user);
                        }}
                      >
                        {" "}
                        Delete User
                      </button>
                )}
                  <button
                    className='btn btn-function'
                    onClick={(e) => changeSet(user)}
                  >
                    {" "}
                    Edit
                  </button>
              </td>
            </tr>
          </tbody>)})}
        </table>
      </div>         
    </div>
  );
}