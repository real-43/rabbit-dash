import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../components/Header';
import Menu from '../../components/MenuBackUp';
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
