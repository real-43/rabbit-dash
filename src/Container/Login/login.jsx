import React, { useState,useRef } from 'react'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router'
import AlertBox from '../../components/alert';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth,provider } from '../../firebase';
import './login.css'

const theme = createTheme();
export default function Login() {

  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState({visible:false, severity:'', message:''});
  const navigate = useNavigate();
  const timerRef = useRef(null);

const handleSubmit = (event) => {
    event.preventDefault();
  signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
    .then(userInformation => {
      console.log(userInformation);
      if (userInfo.email.includes("@rabbit.co.ac.th")){
        navigate('/dashboard')
      }
      else{
        navigate('/')
      }
      
    })
    .catch(error => {
    setAlert({ visible:true,severity:'error',message:error.message})
        console.log(error.code);
        timerRef.current= setTimeout(() => {
          setAlert({ visible:false,severity:'',message:''})
        },2000)
  })
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
    
  const handleGoogleButton = () => {
    signInWithPopup(auth, provider).then(result => {
      console.log(result)
      navigate('/dashboard')
    }).catch(error => {
      console.log(error)
    })
  }

  const normalLogin = async () => {
    try {
        const user = await signInWithEmailAndPassword(
            auth,
            userInfo.email,
            userInfo.password
        );
        navigate("/")
    }catch(err) {
        alert(err);
    }
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
              onClick = {normalLogin}
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
