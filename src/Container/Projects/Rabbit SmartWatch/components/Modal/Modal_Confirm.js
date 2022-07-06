import { Modal, Button } from 'react-bootstrap';
const Modal_Confirm = (props) => {
    return (
        <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Header closeButton style={{ background: '#FF0000' }}>
                <Modal.Title id="contained-modal-title-vcenter">
                    Confirm
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Are you sure you want to delete this email?
                </p>
                <div style={{ textAlign: 'right'}}>
                    <Button onClick={props.onHide} style={{ background: '#FFFFFF', borderColor: '#000000', color: '#000000', fontWeight: 'bold'}}>CANCEL</Button>
                    <Button onClick={props.onConfirm} style={{ background: '#FF0000', borderColor: '#FF0000', marginLeft: '4px', fontWeight: 'bold' }}>DELETE</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}
export default Modal_Confirm