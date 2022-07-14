import React from 'react';
import TableContainer from '../../Container/Projects/Datafile Monitoring/Frontend/TableContainer';
import { data } from '../../Mockup Data/Data';
import { create } from 'react-test-renderer'

test("TableContainerComponent render", () => {

    const columns =  [
        {
            Header: 'ID',
            accessor: 'id',
            Filter: 'NoSearch',
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
            Filter: "SelectColumnFilter",
            filter: 'equals',
        },
        {
            Header: "Status",
            accessor: 'status',
            disableSortBy: true,
            Filter: 'SelectColumnFilter',
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
            Filter: 'DateColumnFilter',
        },
        {
            Header: "Txn Type",
            accessor: 'txnType',
            disableSortBy: true,
            Filter: 'SelectColumnFilter',
            filter: 'equals',
        },
        {
            Header: 'Value',
            accessor: 'value',
        },
        {
            Header: 'Create Date',
            accessor: 'createdAt',
            Filter: 'CNUDateColumnFilter',
        },
        {
            Header: 'Update Date',
            accessor: 'updatedAt',
            Filter: 'CNUDateColumnFilter',
        },
    ]
    const genPDF = false
    const wrapper = create(<TableContainer columns={columns} data={data} genPDF={genPDF}/>).toJSON();
    expect(wrapper).toMatchSnapshot()
})