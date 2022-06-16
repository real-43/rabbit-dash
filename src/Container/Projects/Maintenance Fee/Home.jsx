import React from 'react';
import { MDBDataTableV5 } from 'mdbreact';
import {data} from '../../../Data'

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

  return (
    <div className="content-wrapper" style={{paddingBottom: 30, paddingLeft: 25, paddingRight: 25}}>
    <MDBDataTableV5 
        hover
        entriesOptions={[5, 20, 25]}
        entries={5}
        pagesAmount={4}
        data={data1}
        pagingTop
        searchTop
        searchBottom={false}
        barReverse
    />
    </div>
  );
}

export default DatatablePage;