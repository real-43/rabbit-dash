import React, { Fragment, useState } from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination, 
} from 'react-table';
import { Table, Row, Col, Button, Input } from 'reactstrap';
import { Filter, DefaultColumnFilter } from './filters';
import './Table.css'
import jsPDF from "jspdf";
import "jspdf-autotable";
import Loading from '../../../../components/Loading';

const TableContainer = ({ columns, data, renderRowSubComponent, genPDF }) => {

  const [isLoading, setIsLoading] = useState(false);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : '';
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };

  function exportPDF() {
    setIsLoading(true)
    console.log("loading", isLoading)
    const unit = "pt";
    const size = "A3"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Datafile Mornitoring";
    const headers = [["ID", "DEVICE ID", "LOCATION ID", "SOURCE TYPE", "STATUS", "TXN DATE", "TXN TYPE", "VALUE", "CREATE DATA AT", "UPDATE DATA AT"]];

    const info = []
    page.map((p, index) => {
      let arr = []
      p.cells.map((cell) => {
        arr.push(cell.value)
      })
      info.push(arr)
    })

    let content = {
        startY: 50,
        head: headers,
        body: info
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("report.pdf")
    setIsLoading(false)
    console.log("loading", isLoading)
  }

  return (
    <div className='content-wrapper'>
      <Loading isLoading={isLoading} />
      <div className='pdf-page'>
        <div className='pdf-table'>
          <Fragment >
              <Table bordered hover {...getTableProps()} >
                  <thead className='header-table'>
                      {headerGroups.map((headerGroup) => (
                          <tr {...headerGroup.getHeaderGroupProps()}>
                              {headerGroup.headers.map((column) => (
                                  <th {...column.getHeaderProps()} style={{width: "fit-content"}}>
                                      <div className='header-content' {...column.getSortByToggleProps()}>
                                          {column.render('Header')}
                                          {generateSortingIndicator(column)}
                                      </div>
                                      <Filter column={column} />
                                  </th>
                              ))}
                          </tr>
                      ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                      {page.map((row) => {
                          prepareRow(row);
                          return (
                                  <Fragment key={row.getRowProps().key}>
                                      <tr>
                                          {row.cells.map((cell) => {
                                              return (
                                                  <td className='content-tabel' {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                              );
                                          })}
                                      </tr>
                                  </Fragment>
                              );
                          })}
                  </tbody>
              </Table>

            <Row className='under-table'>
              <Col md={3}>
                <Button
                  color='primary'
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                >
                  {'<<'}
                </Button>
                <Button
                  color='primary'
                  onClick={previousPage}
                  disabled={!canPreviousPage}
                >
                  {'<'}
                </Button>
              </Col>
              <Col md={2} style={{ marginTop: 7 }}>
                Page{' '}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>
              </Col>
              <Col md={2}>
                <Input
                  type='select'
                  value={pageSize}
                  onChange={onChangeInSelect}
                >
                  {'>'}
                  {[10, 20, 30, 40, 50, 10**10].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {(pageSize === 10**10) ? "All" : `${pageSize}`}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col md={3}>
                <Button color='primary' onClick={nextPage} disabled={!canNextPage}>
                  {'>'}
                </Button>
                <Button
                  color='primary'
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  {'>>'}
                </Button>
              </Col>
            </Row>
          </Fragment>
        </div>
        {(genPDF.genPDF) ? (
          <div>
            <button className="pdf-btn" onClick={(e) => exportPDF()}>Generate showing data to PDF</button>
          </div>
        ) : ""}
      </div>
    </div>
  );
};

export default TableContainer;