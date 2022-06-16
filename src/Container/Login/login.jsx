import React, { useState,useRef, useEffect } from 'react'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router'
import AlertBox from '../../components/alert';
import { signInWithEmailAndPassword, signInWithPopup, signOut, deleteUser } from 'firebase/auth';
import { auth,provider } from '../../firebase';
import './login.css'
import { authSec, db } from '../../firebaseSec';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const comp_form = "@rabbit.co.th";
const theme = createTheme();
export default function Login() {

  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState({visible:false, severity:'', message:''});
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const usersCollectionRef = collection(db, "users");
  const [blockUser, setBlockUser] = useState({ id: '',email: '', password: '', isBlock: false });

  function goBlock() {
    const blocker = async () => {
      console.log(blockUser.isBlock)
      if(blockUser.isBlock) {
        setAlert({ visible:true,severity:'error',message:"This account has been bolcked!"})
        timerRef.current= setTimeout(() => {
          setAlert({ visible:false,severity:'',message:''})
        },5000)
      } else {
        await firestoreBlock()
      }

      // console.log("data", data.docs[1])
    };

    const firestoreBlock = async () => {
      
      const userDoc = doc(db, "users", blockUser.id);
      updateDoc(userDoc, {
        "isBlocked": true  
      })
      console.log("id: ", blockUser.email)
    }

    console.log("Block!!")
    blocker();
  }

  function getCurrentProfile() {
    const getUser = async () => {
      const data = await getDocs(usersCollectionRef)
      .then((usersColl) => {
        usersColl.docs.map((doc) => {

          // if email on input equal to email in firestore will setState
          if (doc.data().email === userInfo.email) {
            setBlockUser({
              id: doc.id,
              email: doc.data().email,
              password: doc.data().password,
              isBlock: doc.data().isBlocked
            });
          }
        })
      })
    }
    getUser();
  }

  useEffect(() => {
    console.log("UseEffect")
    getCurrentProfile();
  })

  const handleSubmit = (event) => {
    event.preventDefault();

    if(blockUser.isBlock) {
      setAlert({ visible:true,severity:'error',message:"This account has been bolcked!"})
      timerRef.current= setTimeout(() => {
        setAlert({ visible:false,severity:'',message:''})
      },5000)
    } else {
      signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
        .then(userInformation => {
          console.log(userInformation);
          console.log(userInfo.email.includes(comp_form));
          if (userInfo.email.includes(comp_form)){
            navigate('/dashboard')
          }
          else{
            navigate('/')
          }
          
        })
        .catch(error => {

          if(error.message === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
            goBlock()
          } else {
            setAlert({ visible:true,severity:'error',message:error.message})
            console.log(error.code);
            timerRef.current= setTimeout(() => {
              setAlert({ visible:false,severity:'',message:''})
            },5000)
          }
      })
    }
  };
    
  // const handlePassword = () => {
  //   sendPasswordResetEmail(auth, userInfo.email)
  //     .then(() => {
  //       setAlert({ visible: true, severity: 'success', message: 'Email Sent Successfully' })
  //        timerRef.current= setTimeout(() => {
  //         setAlert({ visible:false,severity:'',message:''})
  //       },2000)
  //     })
  //     .catch(error => {
  //     setAlert({ visible:true,severity:'error',message:error.message})
  //       console.log(error.code);
  //       timerRef.current= setTimeout(() => {
  //         setAlert({ visible:false,severity:'',message:''})
  //       },2000)
  //   })
  // }
    
  const handleGoogleButton = async() => {
    // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    provider.setCustomParameters ({
      'login_hint': "jsmith@rabbit.co.th",
      'hd': 'rabbit.co.th',
      'promp': 'select_account'
    })

    const user = await signInWithPopup(auth, provider).then(result => {
      console.log(result)
      // if (user.auth.email.includes(comp_form)) {
      //   navigate('/dashboard')
      // } else {
      //   deleteUser(user.id)
      //   signOut(auth).then(() => {
      //   navigate('/')
      //   alert("You have to use @rabbit.co.th domain")
      //   console.log("signout");
      //   })
      // }
      navigate('/dashboard')
    }).catch(error => {
      console.log(error)
    })

    
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <AlertBox visible={alert.visible} severity={alert.severity} message={alert.message}/>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src="./rabbitcard-logo.jpg" alt="rabbit-logo" style={{border: '6px solid black', borderRadius:'50%', height: '200px',width: 'auto',marginBottom: "20px"}} />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={userInfo.email}
              onChange={(event)=>{setUserInfo({...userInfo,email:event.target.value})}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={userInfo.password}
              onChange={(event)=>{setUserInfo({...userInfo,password:event.target.value})}}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
          <button className='google_button' onClick={handleGoogleButton}><img src={"./google.png"} alt=''/></button>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
