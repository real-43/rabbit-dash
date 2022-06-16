import React from 'react';
import { MDBDataTable } from 'mdbreact';

const DatatablePage = () => {
  return (
    <div className="content-wrapper">
    <MDBDataTable
      striped
      bordered
      small
      data={data}
    />
    </div>
  );
}

export default DatatablePage;