import { useState } from "react"
import { Modal, Form, Button }  from 'react-bootstrap';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { db } from '../../../../Firebase Config/firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { useDispatch } from "react-redux";
import { addTask } from "../../../../Reducer/firebaseSlice";

export default function EditPermission(props) {

    const animatedComponents = makeAnimated();
    const dispatch = useDispatch()

    const clickedRole = props.clickedRole
    const proOptions = props.proOptions

    const [projectChange, setProjectChange] = useState([])
    const [newRoleName, setNewRoleName] = useState(`${clickedRole.name}`)
    const [projectInput, setProjectInput] = useState(proOptions)
    
    const handleSubmitEdit = async () => {

        dispatch(addTask("Edit role"))

        let update = [...projectChange]
        let sendPro = []
        
        // set value to current
        setProjectChange(update)
        console.log("submit ProjectChange", projectChange)

        // store new value of project to sendPro
        clickedRole.project.map((pro, index) => {
            projectChange.map((proC) => {
                if(pro.name === proC?.name) {
                    sendPro[index] = proC
                } else {
                    sendPro[index] = pro
                }
            })
        })

        console.log("send", sendPro)

        // update field(name and project) in document roles in firestore
        const docRef = doc(db, "roles", clickedRole.id)
        await updateDoc(docRef, {
            "name" : newRoleName,
            "project" : sendPro
        })
    }
    
    return (
        <div>
            <Modal show={true} onHide={props.onClose}>
            <Modal.Header>
                <Modal.Title>Edit Permission <i onClick={props.onClose} style={{cursor:"pointer", marginLeft:"270px"}} className='fa fa-times'/></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={clickedRole.name} //current role name
                            value={newRoleName}
                            onChange={(e) => {setNewRoleName(e.target.value)}}
                            autoFocus
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{display: "flex"}}>Remove Projects </Form.Label>
                        <div className="mb-3">
                            <Select
                                isDisabled={true}
                                defaultValue={proOptions}
                                closeMenuOnSelect={true}
                                components={animatedComponents}
                                isMulti
                                options={proOptions}
                                onChange={(event) => {
                                    setProjectInput(event)
                                }}
                            />
                            <Form.Text className="text-muted" >(Remove projects only)</Form.Text>
                        </div>
                    </Form.Group>

                    {(projectInput.length > 0) ? (
                        <div>
                            {projectInput.map((pro, index) => {
                                let subOptions = []
                                let defOptions = []

                                // Set subMenu in allProjects to format => {value: "", label: ""} and keep at subOptions
                                props.allProjects.map((p) => {
                                    if (pro.value === p.name) {
                                        p.subMenu.map((subM, subMIndex) => {
                                            subOptions[subMIndex] = {value: subM, label: subM}
                                        })
                                    }
                                })

                                // Set subMenu in clickedRole(value form edit btn) to format => {value: "", label: ""} and keep at defOptions
                                clickedRole.project.map((p) => {
                                    if (p.name === pro.value) {
                                        p.subMenu.map((subM, subMIndex) => {
                                            defOptions[subMIndex] = {value: subM, label: subM}
                                        })
                                    }
                                })

                                return (
                                    <Form.Group className="mb-3">
                                    <Form.Label>{pro.label}</Form.Label>
                                    <div className="mb-3">
                                        <Select
                                            defaultValue={defOptions}
                                            closeMenuOnSelect={true}
                                            components={animatedComponents}
                                            isMulti
                                            options={subOptions}
                                            onChange={(event) => {
                                                var arrSubMenu = []
                                                var addSub = [...projectChange]
                                                event.map((e, eIndex) => {
                                                    arrSubMenu[eIndex] = e.value
                                                })
                                                addSub[index] = {name: pro.value, subMenu: arrSubMenu}
                                                setProjectChange(addSub)
                                                console.log("change", projectChange)
                                                console.log("projectinput", projectInput)
                                            }}
                                        />
                                    </div>
                                </Form.Group>
                                )
                            })}
                        </div>
                        
                    ) : ""}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onClose}>
                    Close
                </Button>
                <a onClick={props.onClose} ><Button variant="primary" onClick={() => handleSubmitEdit()}>
                    Save Changes
                </Button></a>
            </Modal.Footer>
            </Modal>
        </div>
    )
}