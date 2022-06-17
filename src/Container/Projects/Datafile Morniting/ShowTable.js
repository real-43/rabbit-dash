import React, { useEffect, useState, useMemo } from 'react';
import {
  Container,
} from 'reactstrap';
import TableContainer from './TableContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SelectColumnFilter } from './filters';
import { data } from '../../../Data'

const ShowTable = () => {
  // const [data, setData] = useState([]);
  // useEffect(() => {
  //   const doFetch = async () => {
  //     const response = await fetch('https://randomuser.me/api/?results=100');
  //     const body = await response.json();
  //     const contacts = body.results;
  //     console.log(contacts);
  //     setData(contacts);
  //     console.log("data", data)
  //   };
  //   doFetch();
  // }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Device ID',
        accessor: 'deviceId',
      },
      {
        Header: 'Location ID',
        accessor: 'locationId',
      },
      {
        Header: 'Source Type',
        accessor: 'sourceType',
        disableSortBy: true,
        Filter: SelectColumnFilter,
        filter: 'equals',
      },
      {
        Header: "Status",
        accessor: 'status',
        disableSortBy: true,
        Filter: SelectColumnFilter,
        filter: 'equals',
      },
      {
        Header: 'Txn Date',
        accessor: 'txnDate',
      },
      {
        Header: "Txn Type",
        accessor: 'txnType',
        disableSortBy: true,
        Filter: SelectColumnFilter,
        filter: 'equals',
      },
      {
        Header: 'Value',
        accessor: 'value',
      },
      {
        Header: 'Create Date',
        accessor: 'createdAt',
      },
      {
        Header: 'Update Date',
        accessor: 'updatedAt',
      },
    ],
    []
  );

  return (
    <div className='content-wrapper'>
      <Container style={{ marginTop: 100 }}>
        <TableContainer
          columns={columns}
          data={data}
        />
      </Container>
    </div>
  );
};

export default ShowTable;