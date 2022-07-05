import React, { useEffect, useState, useMemo } from 'react';
import {
  Container,
} from 'reactstrap';
import TableContainer from './TableContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SelectColumnFilter, DateColumnFilter, NoSearch, CNUDateColumnFilter } from './filters';
import { data } from '../../../Mockup Data/Data'
import './Table.css'
import { NoEncryption } from '@mui/icons-material';

const ShowTable = () => {
  // const [data, setData] = useState([]);
  // useEffect(() => {
  //   const doFetch = async () => {
  //     const response = await fetch('https://randomuser.me/api/?results=100');
  //     const body = await response.json();
  //     const contacts = body.results;
  //     setData(contacts);
  //   };
  //   doFetch();
  // }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Filter: NoSearch,
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
        Header: () => {
          return (
            <div className="header-txn-date">
              <p>Txn Date</p>
              <button onClick={() => window.location.reload(false)}><i className='fas fa-times'></i></button>
            </div>
          )
        },
        accessor: 'txnDate',
        disableSortBy: true,
        Filter: DateColumnFilter,
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
        Filter: CNUDateColumnFilter,
      },
      {
        Header: 'Update Date',
        accessor: 'updatedAt',
        Filter: CNUDateColumnFilter,
      },
    ],
    []
  );

  return (
      <Container>
        <TableContainer
          columns={columns}
          data={data}
        />
      </Container>
  );
};

export default ShowTable;