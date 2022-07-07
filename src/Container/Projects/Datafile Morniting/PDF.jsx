import React, { useEffect } from 'react'
import "jspdf-autotable";
import './PDF.css'
import ShowTable from './ShowTable';
import { useNavigate } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../Firebase Config/firebase';

export default function DataFilePDF() {
    
    const navigate = useNavigate()

    useEffect(() => {
        const authentication = onAuthStateChanged(auth,(user) => {
            if (!user) {
                navigate('/')
            }
        }) 
        
        return authentication
    },[])

  return (
    <div className='PDF-main'>
        <ShowTable genPDF={true}/>
    </div>
  );
}