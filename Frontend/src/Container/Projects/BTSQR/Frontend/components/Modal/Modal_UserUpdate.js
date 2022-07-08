import { Modal, Button } from 'react-bootstrap';
import Select from './Modal_Select';
const Modal_UserUpdate = (props) => {

    return (
        <Modal show={props.show} onHide={props.onHide} size="md" aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit User
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row mx-auto">
                    <div className="col-sm-12">
                        <span>Email</span>
                        <input className="form-control" type="text" value={props.email || ''} readOnly />
                    </div>
                    <div className="col-sm-6 mt-2">
                        <span>Role</span>
                        <Select func_setSelect={props.func_setselect} setState={props.set_select_role} placeholder={props.role} options={props.role_list} />
                    </div>
                    <div className="col-sm-6 mt-2">
                        <span>status</span>
                        <Select func_setSelect={props.func_setselect} setState={props.set_select_status} placeholder={props.status} options={props.status_list} />

                    </div>
                </div>
                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                    <Button onClick={props.onHide} style={{ background: '#E9DCC1', borderColor: '#E9DCC1', fontWeight: 'bold' }}>CANCEL</Button>
                    <Button onClick={props.onConfirm} style={{ background: '#00C4FF', borderColor: '#00C4FF', marginLeft: '4px', fontWeight: 'bold' }}>UPDATE</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}
export default Modal_UserUpdate