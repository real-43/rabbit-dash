import React, { useState, useEffect } from 'react'
import {data} from '../../../Mockup Data/Data'
import jsPDF from "jspdf";
import "jspdf-autotable";
import './PDF.css'
import Loading from '../../../components/Loading';
import ShowTable from './ShowTable';
import { useNavigate } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../Firebase Config/firebase';

export default function DataFilePDF() {

    const [isLoading, setIsLoading] = useState(false)

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
            if (user) {
                navigate('/CreatePermissionAdmin')
            } else {
                navigate('/')
            }
        }) 

        return authentication
    },[])

    function exportPDF() {
        setIsLoading(true)
        const unit = "pt";
        const size = "A3"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Data PDF";
        const headers = [["ID", "DEVICE ID", "LOCATION ID", "SOURCE TYPE", "STATUS", "TXN DATE", "TXN TYPE", "VALUE", "CREATE DATA AT", "UPDATE DATA AT"]];

        const info = data.map(elt=> [elt.id, elt.deviceId, elt.locationId, elt.sourceType, elt.status, elt.txnDate, elt.txnType, elt.value, elt.createdAt, elt.updatedAt]);

        let content = {
            startY: 50,
            head: headers,
            body: info
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("report.pdf")
        setIsLoading(false)
        window.location.reload(false);
    }

  return (
    <div className='content-wrapper'>
        <div className='pdf-page'>
            <div className='pdf-table'>
                <ShowTable />
            </div>
            <div>
                <button className="pdf-btn" onClick={(e) => exportPDF()}>Generate PDF</button>
            </div>
        </div>
    </div>
  );
}