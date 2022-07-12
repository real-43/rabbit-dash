import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../../Firebase Config/firebase'

export default function Dashboard() {

  const router = useNavigate();
  // useEffect(() => {
  //   window.location.reload(false);
  //   setRe(true)
  // },[re])

  useEffect(() => {
    const authentication = onAuthStateChanged(auth, (user) => {
      if (user) {
        router('/dashboard')
      } else {
        router('/')
      }
    })

    return authentication
  }, [])
  
  return (
    <div>
      
    </div>
  );
}
