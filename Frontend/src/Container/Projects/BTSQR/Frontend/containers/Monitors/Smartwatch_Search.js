import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Select from '../../components/component/Select';
import iconSearch from '../../images/iconsearch.png';
import pngRabbit from '../../images/Rabbit.png';
import '../../css/Smartwatch_Search.css';

const Smartwatch_Search = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [partner, setPartner] = useState(null);
    const [type, setType] = useState(null);
    const [serial, setSerial] = useState('');
    const [resdata, setResdata] = useState({});
    const base_api = 'http://localhost:9000'

    const partner_list = [
        { value: '1', label: 'Garmin' },
        { value: '2', label: 'Apple' }
    ]
    const type_list = [
        { value: 'Device_Serial', label: 'Device Serial' },
        { value: 'Rabbit_Serial', label: 'Rabbit Card Serial' }
    ]

    useEffect(() => {
        // console.log(resdata)
    }, [])

    const func_setSelect = (event, setState) => {
        setState(event !== null ? event.value : null)
    }

    const search_Submit = async () => {
        setIsLoading(true);
        try {
            let response = await axios({
                method: 'post',
                url: `${base_api}/api/smartwatch_search`,
                data: {
                    partner: partner,
                    type: type,
                    serial: serial
                },
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'rabbit2020ok'
                }
            });
            let datas = response.data
            setResdata(datas)
            setIsLoading(false)
            console.log(datas)
            // console.log(typeof(datas))
            // console.log(typeof(resdata))
            // console.log(Object.keys(resdata).length)
            // console.log('Partner ' + partner + '\nType ' + type + '\nSerial ' + serial)
        } catch (e) {
            console.log(e)
        }
    }

    const table = () => {
        return (
            <table className="table table-hover table-borderless">
                <thead>
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
                <th className="p17-5" style={{ color: '#000000', fontWeight: 'bold' }}>DEVICE SERIAL</th>
                <th className="p17-5" style={{ color: '#000000', fontWeight: 'bold' }}>DEVICE MODEL</th>
                <th className="p17-5" style={{ color: '#000000', fontWeight: 'bold' }}>RABBIT CARD SERIAL</th>
                <th className="p17-5" style={{ color: '#000000', fontWeight: 'bold' }}>INITIAL DATETIME</th>
                <th className="p17-5" style={{ color: '#000000', fontWeight: 'bold' }}>JOB ID</th>
            </tr>
        )
    }

    const tableBody = () => {
        if (resdata.length > 0) {
            let tableBody = [];
            resdata.forEach((item, i) => {
                tableBody.push(
                    <tr key={i}>
                        <td className="p17-5" style={{ textAlign: 'center' }}>{item.Device_Serial_No}</td>
                        <td className="p17-5" style={{ textAlign: 'center' }}>{item.Device_Model}</td>
                        <td className="p17-5" style={{ textAlign: 'center' }}>{item.Rabbit_Card_ID}</td>
                        <td className="p17-5" style={{ textAlign: 'center' }}>{item.mapping_date_time === null ? '' : item.mapping_date_time.substr(0, 19).replace('T', ' ')}</td>
                        <td className="p17-5" style={{ textAlign: 'center' }}>{item.Job_ID}</td>
                    </tr>
                )
            })
            return tableBody
        }
    }

    const Loading = () => {
        return (
            <div>
                <table className="table table-hover table-borderless">
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

    return (
        <div className="container-fuild">
            <Header />
            <div className="monitor-smartwatch">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-2 align-self-center mt-2" style={{ marginLeft: '10px' }}><Select func_setSelect={func_setSelect} setState={setPartner} placeholder={'Partner'} options={partner_list} /></div>
                        <div className="col-md-3 align-self-center mt-2" style={{ marginLeft: '10px' }}><Select func_setSelect={func_setSelect} setState={setType} placeholder={'Search Type'} options={type_list} /></div>
                        <div className="input-group col-md-4 align-self-center mt-2" style={{ marginLeft: '25px', marginRight: '15px', background: 'white', height: '55px', borderRadius: '30px' }}>
                            <input className="form-control align-self-center search p17-5" style={{ backgroundImage: `url(${iconSearch})`, backgroundSize: '25px 25px', backgroundPosition: '0 9px', backgroundRepeat: 'no-repeat', padding: '0 0 0 35px', border: 0, marginRight: '2px' }} type="text" onChange={(e) => setSerial(e.target.value)} placeholder='Serial number...' />
                            <button className="btn btn-sm float-right align-self-center" onClick={search_Submit} style={{ background: 'orange', borderRadius: '20px', fontSize: '19.5px', width: '100px', color: 'white', fontWeight: 'bold', marginRight: '-4px', width: '100px', height: '40px' }}>Search</button>
                        </div>
                        <div className="box-img">
                            <img src={pngRabbit} style={{ maxHeight: '100%', maxWidth: '100%', display: 'block' }} alt="Rabbit" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="container" style={{ padding: '40px' }}>
                <div className="table-responsive mx-auto">
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
        </div>
    )
}
export default Smartwatch_Search