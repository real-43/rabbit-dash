import React, { useEffect, useRef, useState } from 'react'
import {  createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { authSec, db } from '../../../Firebase Config/firebaseSec';
import { Modal, Form, Button, InputGroup, FormControl }  from 'react-bootstrap';
import { auth } from '../../../Firebase Config/firebase'
import { useNavigate } from 'react-router'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import {
  deleteDoc,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../../components/Loading';

import '../signup.css'
import { addTask } from '../../../Reducer/firebaseSlice';
import EditPopup from './Components/EditPopup';
import ConfirmDelete from '../ConfirmDelete'



export default function ManageUsers() {

  const dispatch = useDispatch()

  const [userInfo, setUserInfo] = useState({ name: '', email: '', password: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [isDel, setIsDel] = useState(false)

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
  const currentRole = useSelector((state) => state.firebase.currentRoleFS)
  const rolesR = useSelector((state) => state.firebase.allRoles)

  const [users, setUsers] = useState([...usersR])
  const [roles, setRoles] = useState([...rolesR])

  // To delete user in firebase
  const deleteUserOnFstored = async (user) => {
    setIsLoading(true);

    dispatch(addTask("Deleting user"))

    setIsDel(false)

    // delete user in firestore
    const userDoc = doc(db, "users", changeUser.id);
    await deleteDoc(userDoc);

    setIsLoading(false);

    // delete user in firebase auth
    signInWithEmailAndPassword(authSec, changeUser.email, changeUser.password)
      .then(() => {
        const userToDel = authSec.currentUser
        deleteUser(userToDel)
        authSec.signOut()
      })

    handleCloseDel()
  };

  useEffect(() => {
    return clearTimeout(timerRef.current)
  },[])

  // update roles when allRoles in reducer change
  useEffect(() => {
    setRoles([...rolesR])
  }, [rolesR])
  // update roles when allUsers in reducer change
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
  const handleChange = (user) => {
    setIsOpen(false)
    setIsLoading(true)

    dispatch(addTask("Updating user info"))

    setChangeUser(user)

    signInWithEmailAndPassword(authSec, user.email, user.password)
      .then((cred) => {
        updateProfile(cred.user, {
          displayName: newName
        })
        updateDoc(doc(db,"users",cred.user.uid), {
          "name": newName,
          "password": newPassword,
        });
        authSec.signOut()
      }
    )

    updateDoc(doc(db,'users',user.id), {
      "role": role
    });


    setIsLoading(false);
  }

  // To Block/Unblock user
  const ControlBlocked = async (user) => {
    setIsLoading(true)

    dispatch(addTask("Blocking user"))

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
    // updateData()
    setIsLoading(false)
  }

  // To create new user in firebase
  const handleSubmit = async (event) => {
    // event.preventDefault();
    setIsLoading(true);

    dispatch(addTask("Creating user"))

    // Create user in auth firebase
    return createUserWithEmailAndPassword(authSec, userInfo.email, userInfo.password).then(
      (cred) => {
        // Create user in firestore
        setDoc(doc(db, "users",cred.user.uid), {
          name: userInfo.name, 
          email: userInfo.email, 
          password: userInfo.password, 
          isBlocked: false,
          role: "" 
        });
        setIsLoading(false);    
        setUserInfo({ name: '', email: '', password: '' })
      }
    );
  };

  const checkDomainRole = (obj) => {
    if (currentUser.role==="Admin"){
      return true
    }
    else{
      if (obj.name.includes(currentRole.project[0].name.split(" ").join(''))) return true
      else return false
    }
  }

  // To open/close popup and set user that send form edit btn
  function changeSet(user) {
    setChangeUser(user)
    setIsOpen(!isOpen)
    setNewName(user.name)
    setNewPassword(user.password)
    setRole(user.role)
  }

  const handleDeleteBtn = (user) => {
    setChangeUser(user)
    setIsDel(true)
  }

  const handleCloseDel = () => {
    setIsDel(false)
    setChangeUser([])
  }

  // To show/unshow pass in edit popup
  function displayOption() {
    setActive(!isActive);
    var x = document.getElementById("myInput");

    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  // Popup input to Edit user infomation
  function popup() {
    
    return (isOpen) ? (
      <div>
        <EditPopup 
          changeUser={changeUser} 
          newName={newName}
          newPassword={newPassword}
          currentUser={currentUser}
          currentRole={currentRole}
          role={role}
          roles={roles}
          onClose={() => {setIsOpen(false)}}
        />
      </div>
    ) : "";
  }

  return (
    <div className="content-wrapper">
      <Loading isLoading={isLoading} />
      
      <div className='input-wrapper'>
        <h5 className="px-4 py-3">Create New User</h5>

        <div className='input-container px-3'>
          <input className='input-register px-2'
            data-testid="inputUserName"
            placeholder="Name..."
            value={userInfo.name}
            onChange={(event) => {
              setUserInfo({ ...userInfo, name: event.target.value })
            }}
          />
          <input className='input-register px-2'
            data-testid="inputEmail"
            type="Email"
            placeholder="Email..."
            value={userInfo.email}
            onChange={(event) => {
              setUserInfo({ ...userInfo, email: event.target.value })
            }}
          />
          <input className='input-register px-2'
            data-testid="inputPassword"
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
      {(isDel) ? (
        <ConfirmDelete 
          onClose={() => setIsDel(false)}
          topic="User"
          onConfirm={() => deleteUserOnFstored(changeUser)}
        />
      ) : ""}
      
      <div className='table-container mx-4 border border-secondary rounded px-3 py-4' >
      <MDBTable borderless>
        <MDBTableHead>
            <tr>
              <th>Number</th>
              <th>First Name</th>
              <th>isBlocked</th>
              <th>Role</th>
              <th>Email</th>
              <th>function</th>
            </tr>
        </MDBTableHead>
      
        {users.map((user, index) => {return (
        <MDBTableBody key={index}>
          <tr>
          {(user.role === "" || currentUser.role === user.role || currentUser.role === "Admin" || user.role.includes(currentUser.role.split("Admin")[0])) ? (
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
                    handleDeleteBtn(user)
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
            </> ) : ""}
          </tr>
        </MDBTableBody>)})}
        </MDBTable>
      </div>         
    </div>
  );
}