import { Modal, Button } from 'react-bootstrap';
import correct_png from '../../images/correct.png'; 
const Modal_Success = (props) => {
    return (
        <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Body>
                <div style={{ textAlign: 'center' }}>
                    <div className="mx-auto" style={{width: '150px', margin: '10px'}}><img src={correct_png} style={{maxHeight:'100%', maxWidth:'100%', display:'block'}} /></div>
                    <div className="mt-2">
                        <span style={{ fontSize: '30px', fontWeight: 'bold'}}>SUCCESS</span>
                    </div>
                    <Button onClick={props.onHide} style={{ background: '#5CFF00', borderColor: '#FFFFFF', color: '#FFFFFF', fontWeight: 'bold', marginTop: '10px' }}>OK</Button>

                </div>
            </Modal.Body>
        </Modal>
    );
}
export default Modal_Success