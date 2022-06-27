import React, { useEffect, useRef, useState } from 'react'
import {  createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, deleteUser, updatePassword, signInWithEmailAndPassword } from "firebase/auth";
import { authSec, db } from '../../firebaseSec';
import {Modal, Form, Button, InputGroup, FormControl}  from 'react-bootstrap';
import { auth } from '../../firebase'
import { useNavigate } from 'react-router'
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";

import Loading from '../../components/Loading';

import './signup.css'

export default function Signup() {

  const [userInfo, setUserInfo] = useState({ name: '', email: '', password: '' });
  const [alert, setAlert] = useState({visible:false, severity:'', message:''});
  const [isOpen, setIsOpen] = useState(false);

  // Use for change profile and password
  const [newPassword, setNewPassword] = useState("")
  const [role, setRole] = useState()
  const [changeUser, setChangeUser] = useState()
  const [newName, setNewName] = useState("")

  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setActive] = useState("false");
  const router = useNavigate();
  const timerRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const usersCollectionRef = collection(db, "users");
  const rolesCollectionRef = collection(db, "roles");

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
    getUsers()
    // window.location.reload(false);
  };

  const getUsers = async () => {
    setIsLoading(true)
    const data = await getDocs(usersCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setIsLoading(false)
  };

  // get all users in firestore and set to variable name "users"
  useEffect(() => {
    const getRoles = async () => {
      const data = await getDocs(rolesCollectionRef);
      setRoles(data.docs.map((doc) => ({ ...doc.data(), id: doc.roleID })));
    };

    getUsers();
    getRoles();
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
    setChangeUser(user)

    // Change in firestore
    const userDoc = doc(db, "users", user.id);

    if (newName !== "") {
      await updateDoc(userDoc, {
        "name": newName
      });
    }

    if (newPassword !== "") {
      await updateDoc(userDoc, {
        "password": newPassword
      });
    }

    if (role !== "") {
      await updateDoc(userDoc, {
        "role": role
      });
    }

    // Change in firebase auth
    await signInWithEmailAndPassword(authSec, user.email, user.password)
    .then(() => {
      const userToChange = authSec.currentUser
      
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
    
    await getUsers()
  }

  const ControlBlocked = async (user) => {
    setIsLoading(true)
    console.log("Controlblocked function")
    const userDoc = doc(db, "users", user.id);
    await updateDoc(userDoc, {
      "isBlocked": !user.isBlocked
      
    });
    setIsLoading(false)
    getUsers();
  }

  // To create new user in firebase
  const handleSubmit = async (event) => {
    setIsLoading(true);

    event.preventDefault();
    
    // Create user in firebase auth
    await createUserWithEmailAndPassword(authSec, userInfo.email, userInfo.password)
      .then((userInformation) => {
        updateProfile(authSec.currentUser, {
          displayName:userInformation.name
        })
      }).catch(error => {
        setAlert({ visible:true,severity:'error',message:error.message})
        console.log(error.code);
        timerRef.current= setTimeout(() => {
          setAlert({ visible:false,severity:'',message:''})
        },2000)
    })

    // To create user in firestore
    await setDoc(doc(db, "users", authSec.currentUser.uid), {
      name: userInfo.name,
      email: userInfo.email,
      password: userInfo.password,
      isBlocked: false,
      role: ""
    })

    setIsLoading(false);
    setUserInfo({ name: '', email: '', password: '' })
    getUsers();
  };

  // To open/close popup and set user that send form edit btn
  function changeSet(user) {
    setChangeUser(user)
    setIsOpen(!isOpen)
    setNewName(user.name)
    setNewPassword(user.password)
    setRole(user.role)
    
  }

  function displayOption() {
    setActive(!isActive);
    var x = document.getElementById("myInput");

    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  // Popup input to chnage password or name
  function popup() {
    
    return (isOpen) ? (
      <div>
        <Modal show={true} onHide={(e)=>{setIsOpen(!isOpen)}}>
          <Modal.Header>
            <Modal.Title>Modal heading <i onClick={(e) => setIsOpen(!isOpen)} style={{cursor:"pointer", marginLeft:"270px"}} className='fa fa-times'/></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={changeUser.name}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Password</Form.Label>
                <InputGroup className="mb-3">
                  
                  <FormControl
                    aria-label="Example text with button addon"
                    aria-describedby="basic-addon1"
                    id='myInput'
                    type="password"
                    placeholder="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button variant="outline-secondary" id="button-addon1">
                    <i class={isActive ? "fa fa-eye" : "fa fa-eye-slash"} id="togglePassword" onClick={(e) => displayOption(this)}/>
                  </Button>
                </InputGroup>
              </Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Select aria-label={role} defaultValue={role} onChange={(e) => setRole(e.target.value)}>
                <option className="d-none" value="">{role}</option>
                {roles.map((role) => {return (
                  <option value={role.name}>{role.name}</option>
                )})}
              </Form.Select>
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

  return (
    <div className="content-wrapper">
      <Loading isLoading={isLoading} />
      
      <div className='input-wrapper'>
        <h4>Create New User</h4>

        <div className='input-container'>
          <input className='input-register'
            placeholder="Name..."
            value={userInfo.name}
            onChange={(event) => {
              setUserInfo({ ...userInfo, name: event.target.value })
            }}
          />
          <input className='input-register'
            type="Email"
            placeholder="Email..."
            value={userInfo.email}
            onChange={(event) => {
              setUserInfo({ ...userInfo, email: event.target.value })
            }}
          />
          <input className='input-register'
            type="Password"
            placeholder="Password..."
            value={userInfo.password}
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
              <th>Number</th>
              <th>First Name</th>
              <th>isBlocked</th>
              <th>Role</th>
              <th>Email</th>
              <th>function</th>
            </tr>
          </thead>
          {users.map((user, index) => {return (
          <tbody>
            <tr>
              <td>{index+1}</td>
              <td>{user.name}</td>
              <td>{user.isBlocked.toString()}</td>
              <td>{user.role}</td>
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
                <Button variant={user.isBlocked ? "outline-danger" : "outline-secondary"} id="button-addon1" >
                    <i class={user.isBlocked ? "fa fa-lock" : "fa fa-unlock"} id="togglePassword" onClick={(e)=>ControlBlocked(user)}/>
                </Button>
              </td>
            </tr>
          </tbody>)})}
        </table>
      </div>         
    </div>
  );
}