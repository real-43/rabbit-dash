import React, { useState } from 'react';
import styled from 'styled-components';

const Button = styled.button`
    margin: 0 2px 0 2px;
    padding: 5px 0 5px 0;
    width: 45px;
    vertical-align: middle;
    color: ${props => props.cur ? '#FF8800' : '#A38F6B'};
    background-color: #FFFFFF;
    border-radius: 50%;
    border: ${props => props.cur ? '2px solid #FF8800' : '2px solid #E6DFCF'};
`
const Pagination = (props) => {
    //paginations
    // const [pagination, setPagination] = useState(props.page);
    const [currentpage, setCurrentPage] = useState(props.currentpage);
    const pageRange = 28;
    const itemsPerPage = 50;
    const [maxPage, setMaxPage] = useState(props.maxpage);

    const jumpPage = (event) => {
        let pageNumber = Math.max(1, event.target.value);
        setCurrentPage(Math.min(pageNumber), maxPage.length);
        props.fnc_changePage(pageNumber);
    }

    const paginations = () => {
        var arrpage = [];
        var startPage = currentpage < 15 ? 1 : currentpage - 14;
        var endpage = pageRange + startPage;
        endpage = maxPage.length < endpage ? maxPage.length : endpage;
        var diff = startPage - endpage + pageRange;
        startPage -= (startPage - diff > 0) ? diff : 0;
        arrpage.push(<Button style={{ display: currentpage > 1 ? 'block' : 'none' }} key='first' value={1} onClick={jumpPage}>{1}</Button>)
        arrpage.push(<Button style={{ display: startPage > 2 ? 'block' : 'none' }} key="..Previous" value={currentpage - 1} onClick={jumpPage}>...</Button>)
        for (let i = startPage; i <= endpage; i++) {
            if (i === currentpage)
                arrpage.push(<Button cur key={i} value={i} onClick={jumpPage}>{i}</Button>)
            else if (i > 1) {
                arrpage.push(<Button key={i} value={i} onClick={jumpPage}>{i}</Button>)
            }
        }
        arrpage.push(<Button style={{ display: maxPage.length - currentpage > 15 ? 'block' : 'none' }} key="..Next" value={currentpage + 1} onClick={jumpPage}>...</Button>)
        arrpage.push(<Button style={{ display: endpage < maxPage.length ? 'block' : 'none' }} key="end" value={maxPage.length} onClick={jumpPage}>{maxPage.length}</Button>)
        return (
            arrpage
        )
    }

    return (
        <>
            {/* {pagination && */}
                <div className="pagination justify-content-center" style={{ padding: '1rem' }}>
                    {/* <button className={disabled === true && currentpage === 1 ? "btn btn-outline-light text-muted disabled" : "btn btn-outline-light text-primary active"} onClick={prev}>Previous</button> */}
                    {paginations()}
                    {/* <button className={disabled === true && currentpage === maxPage ? "btn btn-outline-light text-muted disabled" : "btn btn-outline-light text-primary active"} onClick={next}>Next</button> */}
                </div>
            {/* } */}
        </>
    )
}
export default Pagination