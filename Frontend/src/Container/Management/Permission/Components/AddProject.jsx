import { Modal, Form, Button }  from 'react-bootstrap';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { useState } from 'react';
import { db } from '../../../../Firebase Config/firebase';
import { updateDoc, doc } from 'firebase/firestore';

export default function AddProject(props) {

    const animatedComponents = makeAnimated();

    const [projectChange, setProjectChange] = useState([])
    const clickedRole = props.clickedRole
    const [projectInput, setProjectInput] = useState([])

    const handleSubmitAdd = async () => {

        let sendPro = []
        let update = [...projectChange]

        setProjectChange(update)

        // add new project to current role
        clickedRole.project.map((pro, index) => {
            sendPro[index] = pro
            projectChange.map((proC, proCIndex) => {
                sendPro[index + proCIndex + 1] = proC
            })
        })

        // update field(project) in firestore
        const docRef = doc(db, "roles", clickedRole.id)
        await updateDoc(docRef, {
            "project" : sendPro
        })
    }

    return (
        <div>
            <Modal show={true} onHide={props.onClose}>
                <Modal.Header>
                    <Modal.Title>Add Projects <i onClick={props.onClose} style={{cursor:"pointer", marginLeft:"270px"}} className='fa fa-times'/></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                            type="text"
                            disabled
                            value={clickedRole.name}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Select Projects</Form.Label>
                            <div className="mb-3">
                                <Select
                                    closeMenuOnSelect={true}
                                    components={animatedComponents}
                                    isMulti
                                    options={props.proOptions}
                                    onChange={(event) => {
                                        setProjectInput(event)
                                    }}
                                />
                            </div>
                        </Form.Group>
                        
                        {(projectInput.length > 0) ? (
                            <Form.Group className="mb-3">
                                {projectInput.map((pro, index) => {
                                    let subMenuOptions = []
                                    props.allProjects.map((all) => {
                                        if (all.name === pro.value) {
                                            all.subMenu.map((sub, subIndex) => {
                                                subMenuOptions[subIndex] = {value: sub, label: sub}
                                            })
                                        }
                                    })
                                    return (
                                        <div>
                                            <Form.Label>{pro.value}</Form.Label>
                                            <div className="mb-3">
                                                <Select
                                                    closeMenuOnSelect={true}
                                                    components={animatedComponents}
                                                    isMulti
                                                    options={subMenuOptions}
                                                    onChange={(event) => {
                                                        var arrSubMenu = []
                                                        var addSub = [...projectChange]
                                                        event.map((e, eIndex) => {
                                                            arrSubMenu[eIndex] = e.value
                                                        })
                                                        addSub[index] = {name: pro.value, subMenu: arrSubMenu}
                                                        setProjectChange(addSub)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </Form.Group>
                        ) : ""}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClose}>
                        Close
                    </Button>
                    <a onClick={props.onClose}><Button variant="primary" onClick={() => handleSubmitAdd()} >
                        Add Permission
                    </Button></a>
                </Modal.Footer>
            </Modal>
        </div>
    )
}