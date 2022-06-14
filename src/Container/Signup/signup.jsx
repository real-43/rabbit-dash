import React, { useEffect, useRef, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {  createUserWithEmailAndPassword, sendEmailVerification, updateProfile, onAuthStateChanged, deleteUser, getAuth, sendPasswordResetEmail } from "firebase/auth";
import { authSec, db } from '../../firebaseSec'
import { auth } from '../../firebase'
import { useNavigate } from 'react-router'
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const theme = createTheme();
const user = auth.currentUser;

export default function Signup() {

  const [userInfo, setUserInfo] = useState({ userName: '', email: '', password: '' });
  const [alert, setAlert] = useState({visible:false, severity:'', message:''});
  const router = useNavigate();
  const timerRef = useRef(null);

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(usersCollectionRef, { userName: userInfo.userName, email: userInfo.email, password: userInfo.password });
  };

  const deleteUserOnFstored = async (user) => {
    const userDoc = doc(db, "users", user.id);
    await deleteDoc(userDoc);

    signInWithEmailAndPassword(authSec, user.email, user.password)
      .then(() => {
        const userToDel = authSec.currentUser
        deleteUser(userToDel)
        authSec.signOut()
      })
    // deleteUser(user);
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

  const forgotPassword = (Email) => {
  sendPasswordResetEmail(Email)
      .then(function () {
          alert('Please check your email...')
      }).catch(function (e) {
          console.log(e)
      }) 
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
                  deleteUserOnFstored(user.id);
                }}
              >
                {" "}
                Delete User
              </button>
              <button
                onClick={() => {
                  forgotPassword(user.email);
                }}
              >
                {" "}
                Edit
              </button>
            </td>
          </tr>
        </tbody>)})}
      </table>
      
        
          
  
             
          
    </div>
  );
}
