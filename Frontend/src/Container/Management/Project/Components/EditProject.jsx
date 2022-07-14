import { useState } from "react"
import { useDispatch } from "react-redux";
import { addTask } from "../../../../Reducer/firebaseSlice";
import { Modal, Form, Button }  from 'react-bootstrap';
import ChipInput from 'material-ui-chip-input'
import {
    updateDoc,
    doc,
    arrayUnion,
    arrayRemove,
  } from "firebase/firestore";
import { db } from "../../../../Firebase Config/firebase";

export default function EditProject(props) {

    const dispatch = useDispatch()

    const newSubM = props.newSubM

    const [newProjectName, setNewProjectName] = useState(props.newProjectName)
    const [submenu, setSubmenu] = useState(props.submenu)

    const handleChip = (value) => {
        const chips = submenu.slice();
        chips.push(value);
        setSubmenu(chips[chips.length - 1]);
    };

    const editProject = async (project) =>{

        dispatch(addTask("Edit project"))

        const projectDoc = doc(db, "projects", project.id);

        if (submenu.length < 1) {
            await updateDoc(projectDoc,  {
                "name": newProjectName,
                "subMenu": newSubM
            })
        } else {
            await updateDoc(projectDoc, {
                "name": newProjectName,
                "subMenu": submenu
            });
        }


        props.roles.map((role) =>{ 
            const roleDoc = doc(db, "roles", role.id)
            let newManage = []
            role.Management?.Permission?.map((per) => {
                if(per === project.name) {
                    newManage.push(newProjectName)
                } else {
                    newManage.push(per)
                }
            })
            role.project?.map((proJ) =>{
                if(proJ.name === project.name){
                    updateDoc(roleDoc,{
                        project: arrayRemove({
                            name: project.name,
                            subMenu: project.subMenu
                        }),
                    });
                    if (submenu.length > 0) {
                        updateDoc(roleDoc,{
                            Management: {Permission: newManage, Project: newManage, Services: newManage},
                            project: arrayUnion({
                                name: newProjectName,
                                subMenu: submenu
                            })
                        });   
                    } else {
                        updateDoc(roleDoc,{
                            Management: {Permission: newManage, Project: newManage, Services: newManage},
                            project: arrayUnion({
                                name: newProjectName,
                                subMenu: newSubM
                            })
                        }); 
                    }
                }    
            })
                       
        });
    }

    return (
        <div>
            <Modal show={true} onHide={props.onClose}>
                <Modal.Header>
                    <Modal.Title>Edit Project<i onClick={props.onClose} style={{cursor:"pointer", marginLeft:"320px"}} className='fa fa-times'/></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value.replace(/[^\\]_-/, ""))}
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <ChipInput 
                                style={{paddingTop: "10px",width: "100%",}}
                                defaultValue={newSubM}
                                chips={submenu}
                                onChange={(chips) => handleChip(chips)}                  
                            />
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClose}>
                        Close
                    </Button>
                    <a onClick={props.onClose}><Button variant="primary" onClick={(e) => editProject(props.changeProject)}>
                        Save Changes
                    </Button></a>
                </Modal.Footer>
            </Modal>
        </div>
    )
}