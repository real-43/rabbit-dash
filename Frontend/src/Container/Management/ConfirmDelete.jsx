import { useState } from "react"
import React from "react"
import { Modal, Form, Button, InputGroup, FormControl }  from 'react-bootstrap';

export default function ConfirmDelete(props) {

    return (
        <div>
            <Modal show={true} onHide={props.onClose} centered>
                <Modal.Header>
                    <Modal.Title>Confirm Delete <i onClick={props.onClose} style={{cursor:"pointer", marginLeft:"270px"}} className='fa fa-times'/></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure to delete this {props.topic} ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        props.onClose
                    }>
                        Cancle
                    </Button>
                    <Button variant="primary" onClick={
                        props.onConfirm
                    }>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}