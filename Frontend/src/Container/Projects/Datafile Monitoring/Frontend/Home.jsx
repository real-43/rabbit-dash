import React, { useEffect } from 'react';
import {data} from '../../../../Mockup Data/Data'
import ShowTable from './ShowTable';
import { auth } from '../../../../Firebase Config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router';

const DatatablePage = () => {
  const data1 = {
    columns: [
        {
            label: 'Id',
            field: 'id',
            sort: 'asc',
            width: 150
        },
        {
            label: 'DeviceId',
            field: 'deviceId',
            sort: 'asc',
            width: 100
        },
        {
            label: 'LocationId',
            field: 'locationId',
            sort: 'asc',
            width: 100
        },
        {
            label: 'SourceType',
            field: 'sourceType',
            sort: 'asc',
            width: 50
        },
        {
            label: 'Status',
            field: 'status',
            sort: 'asc',
            width: 80
        },
        {
            label: 'TxnDate',
            field: 'txnDate',
            sort: 'asc',
            width: 80
        },
        {
            label: 'TxnType',
            field: 'txnType',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Value',
            field: 'value',
            sort: 'asc',
            width: 60
        },
        {
            label: 'CreatedAt',
            field: 'createdAt',
            sort: 'asc',
            width: 100
        },
        {
            label: 'UpdatedAt',
            field: 'updatedAt',
            sort: 'asc',
            width: 100
        },
    ],
    rows: data
  };

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
    <div style={{paddingBottom: 30, overflowY: "hidden"}}>

        <ShowTable genPDF={false}/>
    
    </div>
  );
}

export default DatatablePage;