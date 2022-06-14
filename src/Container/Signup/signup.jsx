import React, { useEffect, useRef, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {  createUserWithEmailAndPassword, sendEmailVerification, updateProfile, onAuthStateChanged, deleteUser, updatePassword, signInWithEmailAndPassword } from "firebase/auth";
import { authSec, db } from '../../firebaseSec'
import { auth } from '../../firebase'
import { useNavigate } from 'react-router'
import ReactModal from "react-modal";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// const theme = createTheme();
// const user = auth.currentUser;

export default function Signup() {

  const [userInfo, setUserInfo] = useState({ userName: '', email: '', password: '' });
  const [alert, setAlert] = useState({visible:false, severity:'', message:''});
  const [isOpen, setIsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState(" ")
  const router = useNavigate();
  const timerRef = useRef(null);

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(usersCollectionRef, { userName: userInfo.userName, email: userInfo.email, password: userInfo.password });
    window.location.reload(false);
  };

  const deleteUserOnFstored = async (user) => {
    const userDoc = doc(db, "users", user.id);
    await deleteDoc(userDoc);

    await signInWithEmailAndPassword(authSec, user.email, user.password)
      .then(() => {
        const userToDel = authSec.currentUser
        deleteUser(userToDel)
        authSec.signOut()
      })

    window.location.reload(false);
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
  //On Click of submit button

  const forgotPassword = async (user) => {
    await signInWithEmailAndPassword(authSec, user.email, user.password)
    .then(() => {
      updatePassword(authSec, newPassword)
      authSec.signOut()
    })
    
  }

 

  function confirm(e) {
    if (e) e.preventDefault();
    console.log(" ");
    dismiss();
    setNewPassword("");
  }

  function dismiss() {
    setIsOpen(false);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(authSec, userInfo.email,userInfo.password)
      .then((userInformation) => {
         updateProfile(authSec.currentUser, {
          displayName:userInfo.userName
         })
        createUser();
        sendEmailVerification(authSec.currentUser)
        console.log(userInformation, userInformation.user);
        
        router('/managementUser')
        // window.location.reload(false);
      })
      .catch(error => {
        setAlert({ visible:true,severity:'error',message:error.message})
        console.log(error.code);
        timerRef.current= setTimeout(() => {
          setAlert({ visible:false,severity:'',message:''})
        },2000)
    })
  };
   return (
    <div className="content-wrapper">
      <input
        placeholder="Name..."
        onChange={(event) => {
          setUserInfo({ ...userInfo, userName: event.target.value })
        }}
      />
      <input
        type="Email"
        placeholder="Email..."
        onChange={(event) => {
          setUserInfo({ ...userInfo, email: event.target.value })
        }}
      />
      <input
        type="Password"
        placeholder="Password..."
        onChange={(event) => {
          setUserInfo({ ...userInfo, password: event.target.value })
        }}
      />
      <button onClick={handleSubmit}> Create User</button>
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
            <td> 
              <button
                onClick={() => {
                  deleteUserOnFstored(user);
                }}
              >
                {" "}
                Delete User
              </button>
              <button
                onClick={(e) => setIsOpen(true)}
              >
                {" "}
                Edit
              </button>
              <ReactModal
                appElement={document.getElementById("root")}
                isOpen={isOpen}
                onRequestClose={dismiss}
                style={{
                  overlay: { backgroundColor: "rgba(0,0, 0, 0.30" },
                  content: { width: 400, height: 150 },
                }}
              >
                <form onSubmit={confirm}>
                  <label>
                    Enter some text:
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </label>
                  <button type="submit" onClick={() =>{forgotPassword(user)}}>Confirm</button>
                </form>
              </ReactModal>
            </td>
          </tr>
        </tbody>)})}
      </table>
    </div>
  );
}
