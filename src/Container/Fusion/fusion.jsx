import { onAuthStateChanged, signOut } from 'firebase/auth'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { auth } from '../../firebase'
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import Dashboard from '../../components/Dashboard';
import Footer from '../../components/Footer';
import { authentication } from '../../components/CheckAuth';

export default function Fusion() {

    const router = useNavigate();

    // Check that the user logged in
    useEffect(() => {
        authentication
        
        return authentication
    },[])

    return (
        <div class="wrapper">
            <Header/>
            <Menu/>
            <Dashboard/>
            <Footer/>
        </div>
  )
}
