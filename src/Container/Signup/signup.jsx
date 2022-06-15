import React, { useEffect, useRef, useState } from 'react'
import {  createUserWithEmailAndPassword, sendEmailVerification, updateProfile, onAuthStateChanged, deleteUser, updatePassword, signInWithEmailAndPassword } from "firebase/auth";
import { authSec, db } from '../../firebaseSec';
import {Modal, Form, Button}  from 'react-bootstrap';

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

export default function Signup() {

  const [userInfo, setUserInfo] = useState({ userName: '', email: '', password: '' });
  const [alert, setAlert] = useState({visible:false, severity:'', message:''});
  const [isOpen, setIsOpen] = useState(false);

  // Use for change profile and password
  const [newPassword, setNewPassword] = useState("")
  const [newName, setNewName] = useState("")
  const [changeUser, setChangeUser] = useState()

  const [isLoading, setIsLoading] = useState(false);
  const router = useNavigate();
  const timerRef = useRef(null);

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  // Create user in firestore
  const createUser = async () => {
    await addDoc(usersCollectionRef, { userName: userInfo.userName, email: userInfo.email, password: userInfo.password });
  };

  // To delete user in firebase
  const deleteUserOnFstored = async (user) => {
    setIsLoading(true);

    // delete user in firestore
    const userDoc = doc(db, "users", user.id);
    await deleteDoc(userDoc);

    // delete user in firebase auth
    await signInWithEmailAndPassword(authSec, user.email, user.password)
      .then(() => {
        const userToDel = authSec.currentUser
        deleteUser(userToDel)
        authSec.signOut()
      })

    setIsLoading(false);
    window.location.reload(false);
    };

  // get all users in firestore and set to variable name "users"
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
  
  // Check that the user are logged in
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
    setIsOpen(!isOpen)
    setIsLoading(true)

    // Change in firestore
    const userDoc = doc(db, "users", user.id);

    if (newName !== "") {
      await updateDoc(userDoc, {
        "userName": newName
      });
    }

    if (newPassword !== "") {
      await updateDoc(userDoc, {
        "password": newPassword
      });
    }

    // Change in firebase auth
    await signInWithEmailAndPassword(authSec, user.email, user.password)
    .then(() => {
      const userToChange = authSec.currentUser
      console.log("asdddddddddddddddddddddddddddddddddddddddddddddddd",newName, newPassword);
      
      if(newName !== "") {
        updateProfile(userToChange, {
          displayName: newName
        })
      }

      if(newPassword !== "") {
        updatePassword(userToChange, newPassword)
      }
      setIsLoading(false);
      authSec.signOut()
    })
    
    
    window.location.reload(false);
  }

  // To create new user in firebase
  const handleSubmit = async (event) => {
    setIsLoading(true);

    event.preventDefault();
    
    // To create user in firestore
    const usersCollectionRef = collection(db, "users")
    await addDoc(usersCollectionRef, { userName: userInfo.userName, email: userInfo.email, password: userInfo.password });
    // Create user in firebase auth
    createUserWithEmailAndPassword(authSec, userInfo.email, userInfo.password)
      .then((userInformation) => {
        updateProfile(authSec.currentUser, {
          displayName:userInfo.userName
        })
        // createUser(); 
        
        // router('/managementUser')
      })
      .catch(error => {
        setAlert({ visible:true,severity:'error',message:error.message})
        console.log(error.code);
        timerRef.current= setTimeout(() => {
          setAlert({ visible:false,severity:'',message:''})
        },2000)
    })
    setIsLoading(false);
    window.location.reload(false);
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
        {/* <button onClick={(e) => setIsOpen(!isOpen)}> X </button>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter New Name"
        />
        <input
          type="text"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter New Password"
        />
        
        <button onClick={(e) =>{handleChange(changeUser)}}>Click</button> */}
         <Modal show={true} onHide={(e)=>{setIsOpen(!isOpen)}}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="name@example.com"
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  row={3}
                  autoFocus
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={(e) => setIsOpen(!isOpen)}>
              Close
            </Button>
            <Button variant="primary" onClick={(e) =>{handleChange(changeUser)}}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    ) : "";
  }

  function loadingPopup() {
    return (isLoading) ? (
      <div className='loading-container'>
        <div className='loading-wrapper'>
          <Loader />
        </div>
      </div>
    ) : "";
  }

   return (
    <div className="content-wrapper">
      {loadingPopup()}
      <h3>Management {'>'} User</h3>
      
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
                <button
                  className='btn-function btn'
                  onClick={() => {
                    deleteUserOnFstored(user);
                  }}
                  >
                  {" "}
                  Delete User
                </button>
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