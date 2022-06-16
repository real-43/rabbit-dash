import React from 'react'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact';

const DataFilePDF = () => {

  return (
    <div className='content-wrapper table-PDF'>
      <MDBTable hover>
        <MDBTableHead>
          <tr>
            <th scope='col'>SOURCE TYPE</th>
            <th scope='col'>TRANSACTION DATE</th>
            <th scope='col'>SETTLEMENT DATE</th>
            <th scope='col'>TERMINAL ID</th>
            <th scope='col'>VALUE</th>
            <th scope='col'>TRANSACTION TYPE</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          <tr>
            <th scope='row'>1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope='row'>2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope='row'>3</th>
            <td>Larry the Bird</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@twitter</td>
          </tr>
        </MDBTableBody>
      </MDBTable>
    </div>
  );
}

export default DataFilePDF;