import React, { useEffect, useRef, useState } from 'react'
import {  createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, deleteUser, updatePassword, signInWithEmailAndPassword } from "firebase/auth";
import { authSec, db } from '../../firebaseSec';
import {Modal, Form, Button, InputGroup, FormControl}  from 'react-bootstrap';
import { auth } from '../../firebase'
import { useNavigate } from 'react-router'
import {
  collection,
  deleteDoc,
  updateDoc,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/Loading';

import './signup.css'
import { defindAllUsers, defindAllRoles } from '../../firebaseSlice';

export default function Signup() {

  const dispatch = useDispatch()

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

  const usersR = useSelector((state) => state.firebase.allUsers)
  const currentUser = useSelector((state) => state.firebase.currentUserFS)
  const rolesR = useSelector((state) => state.firebase.allRoles)

  const [users, setUsers] = useState([...usersR])
  const [roles, setRoles] = useState([...rolesR])

  const updateData = async () => {
    await onSnapshot(collection(db,"roles"),(function(querySnapshot) {
      let r = [];
      querySnapshot.forEach(function(doc) {
        r.push({...doc.data(), id: doc.id});
      });
      dispatch(defindAllRoles(r))
      setRoles(r)
    }));

    onSnapshot(collection(db,"users"),(function(querySnapshot) {
      let u = [];
      querySnapshot.forEach(function(doc) {
        u.push({...doc.data(), id: doc.id});
      });
      dispatch(defindAllUsers(u))
      setUsers(u)
    }));
  }

  // To delete user in firebase
  const deleteUserOnFstored = async (user) => {
    setIsLoading(true);

    let index = 0
    let rest = []

    users.map((u) => {
      if(u.id !== user.id) {
        rest[index] = u
        index += 1
      }
    })
    setUsers(rest)

    // delete user in firestore
    const userDoc = doc(db, "users", user.id);
    await deleteDoc(userDoc);

    setIsLoading(false);
    updateData()

    // delete user in firebase auth
    signInWithEmailAndPassword(authSec, user.email, user.password)
      .then(() => {
        const userToDel = authSec.currentUser
        deleteUser(userToDel)
        authSec.signOut()
      })
  };

  useEffect(() => {
    return clearTimeout(timerRef.current)
  },[])

  useEffect(() => {
    setRoles([...rolesR])
  }, [rolesR])

  useEffect(() => {
    setUsers([...usersR])
  }, [usersR])
  
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
    setIsOpen(false)
    setIsLoading(true)
    setChangeUser(user)

    let rest = []

    users.map((u) => {
      if (u.id === user.id) {
        rest.push({...user, name: newName, password: newPassword, role: role})
      }
      rest.push(u)
    })


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
    
    updateData()
  }

  const ControlBlocked = async (user) => {
    setIsLoading(true)
    console.log("Controlblocked function")

    let rest = []

    users.map((u, index) => {
      if(u.id === user.id) {
        rest[index] = {...u, isBlocked: !user.isBlocked}
      }else {
        rest[index] = {...u}
      }
    })

    setUsers(rest)

    const userDoc = doc(db, "users", user.id);
    await updateDoc(userDoc, {
      "isBlocked": !user.isBlocked
      
    });
    updateData()
    setIsLoading(false)
  }

  // To create new user in firebase
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    let uInfo = userInfo

    // let rest = [...users]
    // rest.push({
    //   name: userInfo.name,
    //   email: userInfo.email,
    //   password: userInfo.password,
    //   isBlocked: false,
    //   role: ""
    // })
    // setUsers(rest)

    setUserInfo({ name: '', email: '', password: '' })
    
    // Create user in firebase auth
    await createUserWithEmailAndPassword(authSec, uInfo.email, uInfo.password)
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

    setIsLoading(false);

    // To create user in firestore
    await setDoc(doc(db, "users", "asdf"), {
      name: uInfo.name,
      email: uInfo.email,
      password: uInfo.password,
      isBlocked: false,
      role: ""
    })

    setIsLoading(false);
    updateData()
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
            {(user.role === "" || currentUser.role === user.role || currentUser.role === "Admin") ? (
              <>
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
                  <Button onClick={(e)=>ControlBlocked(user)} variant={user.isBlocked ? "outline-danger" : "outline-secondary"} id="button-addon1" >
                      <i class={user.isBlocked ? "fa fa-lock" : "fa fa-unlock"} id="togglePassword"/>
                  </Button>
                </td>       
              </>
            ) : ""}
            </tr>
          </tbody>)})}
        </table>
      </div>         
    </div>
  );
}