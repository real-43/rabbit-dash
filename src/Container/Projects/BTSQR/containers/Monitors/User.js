import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import '../../css/User.css';
import imgEdit from '../../images/pencil.png';
import imgDelete from '../../images/eraser1.png';
import Modal_Confirm from '../../components/Modal/Modal_Confirm';
import Modal_UserUpdate from '../../components/Modal/Modal_UserUpdate';
import Modal_Success from '../../components/Modal/Modal_Success';

const User = () => {
    const base_api = 'http://localhost:9000';

    const [userData, setUserData] = useState({});

    const [selectemail, setSelectEmail] = useState('');
    const [selectrole, setSelectRole] = useState('');
    const [selectstatus, setSelectStatus] = useState('');




    const [modalDeleteShow, setModalDeleteShow] = useState(false)
    const [modalEditShow, setModalEditShow] = useState(false)
    const [modalSuccessShow, setModalSuccessShow] = useState(false)

    useEffect(() => {
        callApi_getUser();
    }, [])

    const status_list = [
        { value: 'Admin', label: 'Admin' },
        { value: 'User', label: 'User' }
    ]

    const role_list = [
        { value: 'FE', label: 'FE' },
        { value: 'Team Card', label: 'Team Card' }
    ]

    const func_setSelect = (event, setState) => {
        setState(event !== null ? event.value : null)
    }

    const callApi_getUser = async () => {
        let response = await axios({
            method: "get",
            url: `${base_api}/api/getuser`,
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'rabbit2020ok'
            }
        });
        let data = response.data
        setUserData(data)
    }

    const renderTableHeader = () => {
        return (
            <tr>
                <th>#</th>
                <th>Email</th>
                <th>Status</th>
                <th>Login Time</th>
                <th>Logout Time</th>
                <th>Actions</th>
               
            </tr>
        )
    }

    const renderTableData = () => {
        if (userData.length > 0) {
            let tableBody = [];
            userData.forEach((data, index) => {
                tableBody.push(
                    <tr key={index}>
                        <td className="p17-5">{(index + 1)}</td>
                        <td className="p17-5">{data.User}</td>
                        <td className="p17-5">{data.Status}</td>
                        <td className="p17-5">{data.Login_datetime}</td>
                        <td className="p17-5">{data.Logout_datetime}</td>
                        {/* <td className="p17-5">{data.Password}</td> */}
                        {/* <td className="p17-5">{data.Logout}</td> */}
                        <td>
                            <img src={imgEdit} className="img-action" onClick={() => modalEditshow(data.email, data.password, data.status)} />
                            <img src={imgDelete} className="img-action" onClick={() => modalDeleteshow(data.email)} />
                        </td>
                    </tr>
                )
            })
            return tableBody;
        }
    }

    const editUser = async () => {
        let response = await axios({
            method: "put",
            url: `${base_api}/api/user`,
            data: {
                email: selectemail,
                password: selectrole,
                status: selectstatus
            },
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'rabbit2020ok'
            }
        });
        let data = response.data
        setUserData(data.users)
        setModalSuccessShow(true);
    }

    const deleteUser = async () => {
        let response = await axios({
            method: "delete",
            url: `${base_api}/api/user`,
            data: {
                email: selectemail
            },
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'rabbit2020ok'
            }
        });
        let data = response.data
        setUserData(data.users)
        setModalSuccessShow(true);
    }
    
    
    const modalEditshow = (email,  status) => {
        setSelectEmail(email);
        // setSelectRole(role);
        setSelectStatus(status);
  
        setModalEditShow(true)
    }

    const modalDeleteshow = (email) => {
        setSelectEmail(email);
        setModalDeleteShow(true)
    }

    const modalClose = () => {
        setSelectEmail(null);
        // setSelectRole(null);
        setSelectStatus(null);
        setModalDeleteShow(false);
        setModalEditShow(false);
        setModalSuccessShow(false);
    }

    return (
        <div className="container-fuild">
            <Header />
            <div className="carousel-inner monitor-user">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <span className="welcomeText">...</span>
                    </div>
                </div>
            </div>
            <div className="container table-responsive">
                <table className="table table-striped table-bordered table-hover">
                    <tbody>
                        {renderTableHeader()}
                        {renderTableData()}
                    </tbody>
                </table>
            </div>
            <Modal_Success 
                show={modalSuccessShow}
                onHide={() => modalClose()}
            />
            <Modal_Confirm
                show={modalDeleteShow}
                onHide={() => modalClose()}
                onConfirm={() => deleteUser()}
            />
            <Modal_UserUpdate
                func_setselect={func_setSelect}
                set_select_role={setSelectRole}
                set_select_status={setSelectStatus}
                status_list={status_list}
                role_list={role_list}
                email={selectemail}
                role={selectrole}
                status={selectstatus}
                show={modalEditShow}
                onHide={() => modalClose()}
                onConfirm={() => editUser()}
            />
            
        </div>
    )
}
export default User