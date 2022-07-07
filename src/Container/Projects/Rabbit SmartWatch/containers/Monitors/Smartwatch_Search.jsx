import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from '../../components/component/Select';
// import iconSearch from '../../images/iconsearch.png';
import pngRabbit from '../../images/Rabbit.png';
import Paginations from '../../components/component/Pagination';
import { base_api } from '../../config';
import '../../css/Smartwatch_Search.css';

const Smartwatch_Search = () => {

    const partner_list = [
        { value: '1', label: 'Garmin' },
        { value: '2', label: 'Apple' }
    ]
    const type_list = [
        { value: 'Device_Serial_No', label: 'Device Serial' },
        { value: 'Rabbit_Card_ID', label: 'Rabbit Card Serial' }
    ]

    const [isLoading, setIsLoading] = useState(false);
    const [noData, setNodata] = useState(false);
    const [resData, setResData] = useState({});

    //paginations
    const [pagination, setPagination] = useState(false);
    const [currentpage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const [maxPage, setMaxPage] = useState([]);

    const [oldpartner, setOldPartner] = useState(null);
    const [oldtype, setOldType] = useState(null);
    const [oldserial, setOldSerial] = useState('');

    const [partner, setPartner] = useState(partner_list[0].value);
    const [type, setType] = useState(type_list[0].value);
    const [serial, setSerial] = useState('');
    const [checkbox, setCheckbox] = useState(false);


    useEffect(() => {
        setCheckbox(checkbox);
        handleSearch()
    }, [checkbox]);

    const func_setSelect = (event, setState) => {
        setState(event !== null ? event.value : null)
    }

    const search_Submit = async () => {
        try {
            setOldPartner(partner)
            setOldType(type)
            setOldSerial(serial)
            let response = await axios({
                method: 'post',
                url: `${base_api}/smartwatch_search`,
                data: {
                    partner: partner,
                    type: type,
                    serial: serial,
                    page: 1,
                    limitpage: itemsPerPage,
                    checkbox: checkbox
                },
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'rabbit2020ok'
                }
            });
            let counts = Object.values(response.data.rowcount[0])
            let datas = response.data.data;
            if (datas.length === 0) {
                setNodata(true);
                setResData(datas)
                setIsLoading(false);
            } else {
                let maxpages = []
                for (let i = 1; i <= Math.ceil(counts[0] / itemsPerPage); i++) {
                    maxpages.push(i)
                }
                setNodata(false);
                setMaxPage(maxpages);
                setResData(datas)
                setPagination(true);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleSearch = async () => {
        setIsLoading(true);
        // setNodata(false);
        setPagination(false);
        // setDisabled(false);
        setCurrentPage(1)
        search_Submit();
    }

    const changePage = async (Page) => {
        try {
            setIsLoading(true);
            var response = await axios({
                method: 'post',
                url: `${base_api}/smartwatch_search`,
                data: {
                    partner: oldpartner,
                    type: oldtype,
                    serial: oldserial,
                    page: Page,
                    limitpage: itemsPerPage,
                    checkbox: checkbox
                },
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'rabbit2020ok'
                }
            });
            let datas = response.data.data;
            if (datas.length === 0) {
                setResData(datas);
                setIsLoading(false);
            } else {
                setResData(datas);
                setPagination(true);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const table = () => {
        return (
            <table className="table table-responsive-sm table-bordered table-striped text-center">
                <thead className="table-primary">
                    {tableHeader()}
                </thead>
                <tbody>
                    {tableBody()}
                </tbody>
            </table>
        )
    }

    const tableHeader = () => {
        return (
            <tr>
                <th className="p17-5 py-3" style={{ color: '#000000', fontWeight: 'bold' }}>DEVICE SERIAL</th>
                <th className="p17-5 py-3" style={{ color: '#000000', fontWeight: 'bold' }}>DEVICE UNIQUE ID</th>
                <th className="p17-5 py-3" style={{ color: '#000000', fontWeight: 'bold' }}>DEVICE MODEL</th>
                <th className="p17-5 py-3" style={{ color: '#000000', fontWeight: 'bold' }}>RABBIT CARD SERIAL</th>
                <th className="p17-5 py-3" style={{ color: '#000000', fontWeight: 'bold' }}>INITIAL DATETIME</th>
                <th className="p17-5 py-3" style={{ color: '#000000', fontWeight: 'bold' }}>STATUS</th>
                <th className="p17-5 py-3" style={{ color: '#000000', fontWeight: 'bold' }}>REFURBISHED TO</th>
                <th className="p17-5 py-3" style={{ color: '#000000', fontWeight: 'bold' }}>REFURBISHED DATETIME</th>
            </tr>
        )
    }

    const tableBody = () => {
        if (resData.length > 0) {
            let tableBody = [];
            resData.forEach((item, i) => {
                tableBody.push(
                    <tr key={i}>
                        <td className="p17-5" style={{ textAlign: 'center' }}>{item.Device_Serial_No}</td>
                        <td className="p17-5" style={{ textAlign: 'center' }}>{item.Device_Unique_ID}</td>
                        <td className="p17-5" style={{ textAlign: 'center' }}>{item.Device_Model}</td>
                        <td className="p17-5" style={{ textAlign: 'center' }}>{item.Rabbit_Card_ID}</td>
                        <td className="p17-5" style={{ textAlign: 'center' }}>
                            {item.Job_ID === null ? '' : item.mapping_date_time === null ? '' : item.mapping_date_time.substr(0, 19).replace('T', ' ')}
                        </td>
                        <td className="p17-5" style={{ textAlign: 'center' }}>
                            {item.Refurbished_To !== null ? 'Refurbished' : item.Job_Status === '0' ? 'Done' : item.Job_Status === '1' ? 'Doing' : ''}
                        </td>
                        <td className="p17-5" style={{ textAlign: 'center' }}>{item.Refurbished_To}</td>
                        <td className="p17-5" style={{ textAlign: 'center' }}>
                            {item.Job_ID === null ? '' : item.refurbished_date_time === null ? '' : item.refurbished_date_time.substr(0, 19).replace('T', ' ')}
                        </td>
                    </tr>
                )
            })
            return tableBody
        }
    }

    const Loading = () => {
        return (
            <div>
                <table className="table my-4">
                    <thead>
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
    // const fnc_checkbox = async (e) => {
    //     var test = await e.target.checked
    //     console.log('1he',checkbox,test)
    //     setCheckbox(test)
    //     // handleSearch()
    //     console.log('2',checkbox)
    // }
    const handleClick = (e) => {
        console.log('asd', checkbox,e.target.checked)
        setCheckbox(e.target.checked)
        console.log('e', checkbox)
    }
    return (
        <>
            <div className="content-wrapper">
                {/* <Header /> */}
                <div className="monitor-smartwatch">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-2 align-self-center mt-2" style={{ marginLeft: '10px' }}><Select func_setSelect={func_setSelect} setState={setPartner} placeholder={'Partner'} options={partner_list} /></div>
                            <div className="col-md-3 align-self-center mt-2" style={{ marginLeft: '10px' }}><Select func_setSelect={func_setSelect} setState={setType} placeholder={'Search Type'} options={type_list} /></div>
                            <div className="input-group col-md-4 align-self-center my-2 mx-3" style={{ marginLeft: '25px', marginRight: '15px', background: 'white', height: '55px', borderRadius: '30px',border: "1px solid #d4d4d4" }}>
                                <i class="fa fa-search px-1" aria-hidden="true" style={{ marginTop: '19px' }}></i>
                                <input className="form-control align-self-center search p17-5" style={{padding: '0 0 0 35px', border: 0, marginRight: '2px' }} type="text" onChange={(e) => setSerial(e.target.value)} placeholder='Serial number...' />
                                <button className="btn btn-sm float-right align-self-center" onClick={handleSearch} style={{ background: 'orange', borderRadius: '20px', fontSize: '19.5px', width: '100px', color: 'white', fontWeight: 'bold', marginRight: '-4px', width: '100px', height: '40px' }}>Search</button>
                            </div>
                            <div className="box-img">
                                <img src={pngRabbit} style={{ maxHeight: '100%', maxWidth: '100%', display: 'block' }} alt="Rabbit" className="m-auto" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid" style={{ padding: '5px'}}>
                    <div className="text-left mx-auto col-lg-10 col-md-12" style={{ padding: '0 3.2rem' }}>
                        <input className="form-check-input" type="checkbox" defaultChecked={checkbox} onChange={e => setCheckbox(e.target.checked) } />
                        <label className="form-check-label" style={{ fontSize: '14px' }}>
                            Sort By Initial Datetime
                        </label>
                    </div>
                    <div className="table-responsive mx-auto col-lg-10 col-md-12">
                        {isLoading === true ?
                            Loading()
                            :
                            // noData === true ?
                            //     Nodata()
                            //     :
                            table()
                        }
                    </div>
                </div>
                <div style={{marginBottom: "50px"}}>
                    {pagination === true ?
                        <Paginations currentpage={1} maxpage={maxPage} fnc_changePage={changePage} />
                        :
                        ''
                    }
                </div>
            </div>
        </>
    )
}
export default Smartwatch_Search