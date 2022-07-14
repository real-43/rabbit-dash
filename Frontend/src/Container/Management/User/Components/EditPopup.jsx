import React, { useState } from 'react'
import { Modal, Form, Button, InputGroup, FormControl }  from 'react-bootstrap';
import { updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { authSec, db } from '../../../../Firebase Config/firebaseSec';
import {
    updateDoc,
    doc,
  } from "firebase/firestore";
import { addTask } from '../../../../Reducer/firebaseSlice';
import { useDispatch } from 'react-redux';

const EditPopup = props => {

    const dispatch = useDispatch()

    const [changeUser, setChangeUser] = useState(props.changeUser)
    const [newPassword, setNewPassword] = useState(props.newPassword)
    const [newName, setNewName] = useState(props.newName)
    const [isActive, setActive] = useState(false)
    const [role, setRole] = useState(props.role)
    const [isConfirm, setIsConfirm] = useState(false)
    const roles = props.roles

    const confirmPopup = () => {

        return (isConfirm) ? (
            <Modal show={true} onHide={() => setIsConfirm(false)}>
                <Modal.Header>
                    <Modal.Title>Confirm<i onClick={() => setIsConfirm(false)} style={{cursor:"pointer", marginLeft:"330px"}} className='fa fa-times'/></Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsConfirm(false)}>
                        Close
                    </Button>
                    <Button variant="primary" name="primary" onClick={
                        props.handleClose
                    }>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        ) : ""
    }

    // Change Name or Password in firebase
    const handleChange = (event, user) => {

        event.preventDefault()
        setIsConfirm(true)

        dispatch(addTask("Updating user info"))

        setChangeUser(user)

        if(newName !== changeUser.name || newPassword !== changeUser.password) {
            signInWithEmailAndPassword(authSec, user.email, user.password)
            .then((cred) => {
                console.log("cred", cred.user.uid)
                updateProfile(cred.user, {
                    displayName: newName
                })
                authSec.signOut()
            })
            updateDoc(doc(db,"users",changeUser.id), {
                "name": newName,
                "password": newPassword,
            });
        }

        updateDoc(doc(db,'users',user.id), {
            "role": role
        });
    }

    const checkDomainRole = (obj) => {
        if (props.currentUser.role==="Admin") {
          return true
        }
        else{
          if (obj.name.includes(props.currentRole.project[0].name.split(" ").join(''))) return true
          else return false
        }
    }

    // To show/unshow pass in edit popup
    function displayOption() {
        setActive(!isActive);
        var x = document.getElementById("myInput");

        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }

    return (
        <div>
            {confirmPopup()}
            <Modal show={true} onHide={props.onClose}>
                <Modal.Header>
                    <Modal.Title>Edit User<i onClick={props.onClose} style={{cursor:"pointer", marginLeft:"330px"}} className='fa fa-times'/></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                        type="text"
                        // placeholder={changeUser.name}
                        value={newName}
                        onChange={(e) => {setNewName(e.target.value)}}
                        autoFocus
                        />
                    </Form.Group>
                    <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                    >
                        <Form.Label>Password</Form.Label>
                        <InputGroup className="mb-3">
                        
                        <FormControl
                            aria-label="Example text with button addon"
                            aria-describedby="basic-addon1"
                            id='myInput'
                            type="password"
                            placeholder="password"
                            value={newPassword}
                            onChange={(e) => {setNewPassword(e.target.value)}}
                        />
                        <Button variant="outline-secondary" id="button-addon1" onClick={(e) => {displayOption(this)}}>
                            <i class={isActive ? "fa fa-eye" : "fa fa-eye-slash"} id="togglePassword"/>
                        </Button>
                        </InputGroup>
                    </Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Form.Select aria-label={role} defaultValue={role} onChange={(e) => setRole(e.target.value)}>
                        <option className="d-none" value="">{role}</option>
                        <option value="">Set No role</option>
                        {roles.filter(obj => checkDomainRole(obj)).map((role,i) => {return (
                        <option value={role.name} key={i}>{role.name}</option>
                        )})}
                    </Form.Select>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={(event) => {handleChange(event, changeUser)}}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EditPopup