import React from 'react'
import { MDBDataTableV5 } from 'mdbreact';
import {data} from '../../../Data'
import jsPDF from "jspdf";
import "jspdf-autotable";

const DataFilePDF = () => {

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

    function exportPDF() {
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
    }

  return (
    <div className="content-wrapper" style={{paddingBottom: 60, paddingLeft: 25, paddingRight: 25, pagingTop: 10}}>
        <MDBDataTableV5 
            hover 
            sortable={false} 
            data={data1}
            pagingTop
            searchTop
            searchBottom={false}
            barReverse
        />

        <button onClick={(e) => exportPDF()}>Generate Report</button>
    </div>
  );
}

export default DataFilePDF;