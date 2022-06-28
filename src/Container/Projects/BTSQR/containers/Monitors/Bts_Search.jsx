import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Select from '../../components/component/Select';
import Date_range_picker from '../../components/component/date-range-picker';

const Search = () => {
    const { handleSubmit } = useForm();
    const [QRgens, setQRgens] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [noData, setNodata] = useState(false);

    //paginations
    const [pagination, setPagination] = useState(false);
    const [currentpage, setCurrentPage] = useState(1);
    const pageRange = 8;
    const itemsPerPage = 50;
    const [maxPage, setMaxPage] = useState([]);

    //button show
    const [disabled, setDisabled] = useState(false);

    //dataforapi
    const [StationCode, setStationCode] = useState('');
    const [TerminalId, setTerminalId] = useState('');
    const [RefNumber, setRefNumber] = useState('');
    const [FormDate, setFormDate] = useState('');
    const [ToDate, setToDate] = useState('');


    //dataforapi
    const [oldStationCode, setOldStationCode] = useState('');
    const [oldTerminalId, setOldTerminalId] = useState('');
    const [oldRefNumber, setOldRefNumber] = useState('');
    const [oldFormDate, setOldFormDate] = useState('');
    const [oldToDate, setOldToDate] = useState('');

    const [stationList, setStationList] = useState([])
     const base_api = 'http://localhost:9000'
    // const base_api = ''

    useEffect(() => {
        let dates = new Date();
        let date = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + (dates.getDate() < 10 ? '0' + dates.getDate() : dates.getDate());
        setFormDate(date)
        setToDate(date);
        const fetchData = async () => {
            let response = await axios({
                method: "get",
                url: `${base_api}/api/get_bss_stations`,
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'rabbit2020ok'
                }
            });
            let datas = response.data
            let arroptions = []
            datas.forEach(data => {
                arroptions.push({
                    value: data.SP_BranchId,
                    label: data.bss_loc_des
                })
            })
            setStationList(arroptions)
        }
        fetchData();

    }, [])

    const resApi = async () => {
        try {
            setOldStationCode(StationCode);
            setOldTerminalId(TerminalId);
            setOldRefNumber(RefNumber);
            setOldFormDate(FormDate);
            setOldToDate(ToDate);
            let response = await axios({
                method: "post",
                url: `${base_api}/api/bss_gw_qr_req`,
                data: {
                    stationCode: StationCode,
                    terminalId: TerminalId,
                    refNumber: RefNumber,
                    formDate: FormDate,
                    toDate: ToDate,
                    page: 1,
                    limitpage: itemsPerPage
                },
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'rabbit2020ok'
                }
            });
            let counts = Object.values(response.data.rowcount[0])
            let datas = response.data.data;
            console.log(datas)
            if (datas.length === 0) {
                setNodata(true);
                setQRgens(datas);
                setIsLoading(false);
            } else {
                let maxpages = []
                for (let i = 1; i <= Math.ceil(counts[0] / itemsPerPage); i++) {
                    maxpages.push(i)
                }
                setMaxPage(maxpages);
                setDisabled(true);
                setQRgens(datas);
                setPagination(true);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const changePage = async (Page) => {

        setIsLoading(true);
        setPagination(false);
        try {
            let response = await axios({
                method: "post",
                url: `${base_api}/api/bss_gw_qr_req_page`,
                data: {
                    stationCode: oldStationCode,
                    terminalId: oldTerminalId,
                    refNumber: oldRefNumber,
                    formDate: oldFormDate,
                    toDate: oldToDate,
                    page: Page,
                    limitpage: itemsPerPage
                },
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'rabbit2020ok'
                }
            });
            let datas = response.data.data;
            if (datas.length === 0) {
                setQRgens(datas);
                setIsLoading(false);
            } else {
                setQRgens(datas);
                setPagination(true);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const mySubmitHandler = async (data) => {
        setNodata(false);
        setIsLoading(true);
        setPagination(false);
        setDisabled(false);
        setCurrentPage(1)
        resApi();
    }

    const func_setSelect = (event, setState) => {
        setState(event !== null ? event.value : null)
    }

    const func_setSelectDate = (event, setState) => {
        setState(event)
    }

    const table = () => {
        return (
            <table className="table table-responsive-sm table-bordered table-striped text-center">
                <thead className="table-primary">
                    {tableHeader()}
                </thead>
                {tableBody()}
            </table>
        )
    }

    const tableHeader = () => {
        return (
            <tr>
                
                <th className="p17-5" style={{ width: "5%" }}>#</th>
                <th className="p17-5" style={{ width: "13%" }}>
                    Station
                    <div className="align-self-center" style={{ marginLeft: '10px' }}><Select func_setSelect={func_setSelect} setState={setStationCode} placeholder={'Station'} options={stationList} /></div>
                </th>
                <th className="p17-5" style={{ width: "10%" }}>
                    Terminal Code
                    <div className="align-self-center"><input className="form-control align-self-center search p17-5" type="text" name="terminalId" style={{ borderRadius: '4px', fontWeight: 'bold' }} placeholder='Terminal' onChange={(e) => setTerminalId(e.target.value)} /></div>
                </th>
                <th className="p17-5" style={{ width: "15%" }}>
                    Referent Number
                    <div className="align-self-center"><input className="form-control align-self-center search p17-5" type="text" name="refNumber" style={{ borderRadius: '4px', fontWeight: 'bold' }} placeholder='Reference number' onChange={(e) => setRefNumber(e.target.value)} /></div>
                </th>
                <th className="p17-5" style={{ width: "7%" }}>
                    QR type
                </th>
                <th className="p17-5" style={{ width: "30%" }}>
                    Create Date
                    <Date_range_picker func_setSelect={func_setSelectDate} setformdate={setFormDate} settodate={setToDate}/>
                </th>
                <th className="p17-5" style={{ width: "6%" }}>Amount</th>
                <th className="p17-5" style={{ width: "14%" }}>Payment</th>
                <th className="p17-5" style={{ width: "14%" }}>confirm</th>
            </tr>
        )
    }

    const tableBody = () => {
        if (QRgens.length > 0) {
            let tableBody = [];
            QRgens.forEach((detail, index) => {
                tableBody.push(
                    <tr key={index}>
                        <td className="p17-5">{(index + 1) + ((currentpage - 1) * itemsPerPage)}</td>
                        <td className="p17-5">{detail.branchname}</td>
                        <td className="p17-5">{detail.terminalid}</td>
                        <td className="p17-5">{detail.reference1}</td>
                        <td className="p17-5">{detail.qrtype}</td>
                        <td className="p17-5">{detail.reqdatetime.substr(0, 19).replace('T', ' ')}</td>
                        <td className="p17-5">{detail.amount}</td>
                        {detail.confirm_datetime != null ? <td className="p17-5" style={{ color: "Green" }}>Payment</td> : <td className="p17-5" style={{ color: "Red" }}>No Payment</td>}
                        <td className="p17-5">{detail.confirm_datetime != null ? detail.confirm_datetime.substr(0, 19).replace('T', ' ') : ''}</td>
                    </tr>
                )
            })
            return <tbody>{tableBody}</tbody>;
        }
    }

    const Loading = () => {
        return (
            <div>
                <table className="table table-responsive-sm table-bordered table-striped text-center">
                    <thead className="table-primary">
                        {tableHeader()}
                    </thead>
                </table>
                <div className="d-flex justify-content-center mb-3">
                    <div className="spinner-border" role="status" style={{ color: '#FF7E00' }}>
                        <span className="sr-only p17-5">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }

    const Nodata = () => {
        return (
            <div>
                <table className="table table-responsive-sm table-bordered table-striped text-center">
                    <thead className="table-primary">
                        {tableHeader()}
                    </thead>
                </table>
                <div className="justify-content-center text-center">
                    <p className="font-weight-bold text-danger p17-5">No data</p>
                </div>
            </div>
        )
    }

    const next = () => {
        let pageNumber = Math.min(currentpage + 1, maxPage.length);
        setCurrentPage(pageNumber);
        changePage(pageNumber);
    }

    const prev = () => {
        let pageNumber = Math.max(currentpage - 1, 1);
        setCurrentPage(pageNumber);
        changePage(pageNumber);
    }

    const jumpPage = (event) => {
        let pageNumber = Math.max(1, event.target.value);
        setCurrentPage(Math.min(pageNumber), maxPage);
        changePage(pageNumber);
    }

    const paginations = () => {
        let arrpage = [];
        let startPage = currentpage < 5 ? 1 : currentpage - 4;
        let endpage = pageRange + startPage;
        endpage = maxPage.length < endpage ? maxPage.length : endpage;
        let diff = startPage - endpage + pageRange;
        startPage -= (startPage - diff > 0) ? diff : 0;
        arrpage.push(<button className="btn btn-outline-light text-primary" style={{ display: currentpage > 1 ? 'block' : 'none' }} key='first' value={1} onClick={jumpPage}>{1}</button>)
        arrpage.push(<button className="btn btn-outline-light text-primary" style={{ display: startPage > 2 ? 'block' : 'none' }} key="..Previous" value={currentpage - 1} onClick={jumpPage}>...</button>)
        for (let i = startPage; i <= endpage; i++) {
            if (i === currentpage)
                arrpage.push(<button className="btn btn-primary" key={i} value={i} onClick={jumpPage}>{i}</button>)
            else if (i > 1) {
                arrpage.push(<button className="btn btn-outline-light text-primary" key={i} value={i} onClick={jumpPage}>{i}</button>)
            }
        }
        arrpage.push(<button className="btn btn-outline-light text-primary" style={{ display: maxPage.length - currentpage > 5 ? 'block' : 'none' }} key="..Next" value={currentpage + 1} onClick={jumpPage}>...</button>)
        arrpage.push(<button className="btn btn-outline-light text-primary" style={{ display: endpage < maxPage.length ? 'block' : 'none' }} key="end" value={maxPage.length} onClick={jumpPage}>{maxPage.length}</button>)
        return (
            arrpage
        )
    }

    return (
        <div className="content-wrapper">
            {/* <Header /> */}
            <div className="Search" >
                <div className="justify-content-center mx-auto">
                    <form className="Search" onSubmit={handleSubmit(mySubmitHandler)}>
                            {/* <div className="align-self-center"><input className="form-control align-self-center search p17-5" type="date" name="formDate" style={{ borderRadius: '20px' }} value={FormDate} onChange={(e) => setFormDate(e.target.value)} /></div>
                            <div className="align-self-center"><input className="form-control align-self-center search p17-5" type="date" name="toDate" style={{ borderRadius: '20px' }} value={ToDate} onChange={(e) => setToDate(e.target.value)} /></div> */}
                            <button className="btn btn-success align-self-center" style={{ marginLeft: 5, height: 38 }} type="submit">Search</button>
                    </form>
                </div>
            </div>
            <div className="container-fuild mx-auto">
                <div className="mt-3 w-100">
                    {/* <form className="" onSubmit={handleSubmit(mySubmitHandler)}>
                        <div className="input-group justify-content-center">
                            <label className="font-weight-bold text-secondary text-center">Station Code<div className="text-left" style={{ width: '200px' }}><Select onChange={(e) => changeStationCode(e)} isClearable={true} placeholder='' options={options} /></div></label>
                            <label className="font-weight-bold text-secondary text-center">Terminal Code<input className="form-control" type="text" name="terminalId" onChange={(e) => setTerminalId(e.target.value)} /></label>
                            <label className="font-weight-bold text-secondary text-center">Reference Number<input className="form-control" type="text" name="refNumber" onChange={(e) => setRefNumber(e.target.value)} /></label>
                            <label className="font-weight-bold text-secondary text-center">Form Date<input className="form-control" type="date" name="formDate" value={FormDate} onChange={(e) => setFormDate(e.target.value)} /></label>
                            <label className="font-weight-bold text-secondary text-center">To Date<input className="form-control" type="date" name="toDate" value={ToDate} onChange={(e) => setToDate(e.target.value)} /></label>
                            <button className="btn btn-success" style={{ marginTop: 25, marginLeft: 5, height: 38 }} type="submit">Search</button>
                        </div>
                    </form> */}
                    {isLoading === true ?
                        Loading()
                        :
                        noData === true ?
                            Nodata()
                            :
                            table()
                    }
                    {pagination &&
                        <nav className="Page navigation example">
                            <ul className="pagination justify-content-center">
                                <button className={disabled === true && currentpage === 1 ? "btn btn-outline-light text-muted disabled" : "btn btn-outline-light text-primary active"} onClick={prev}>Previous</button>
                                {paginations()}
                                <button className={disabled === true && currentpage === maxPage.length ? "btn btn-outline-light text-muted disabled" : "btn btn-outline-light text-primary active"} onClick={next}>Next</button>
                            </ul>
                        </nav>
                    }
                </div>
            </div >
        </div >
    )

}
export default Search;