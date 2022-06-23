import React, { useState } from 'react'
import { Table } from 'react-bootstrap';
import { getProjects, getRoles } from '../../MyFireStore';
import { useNavigate } from 'react-router'
import {Modal, Form, Button, InputGroup, FormControl}  from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { async } from '@firebase/util';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import Loading from '../../components/Loading';

export default function Permission() {

    const animatedComponents = makeAnimated();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState();

    const [allRoles, setAllRoles] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [clickedRole, setClickedRole] = useState({});

    const [isPopup, setIsPopup] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");

    const [proOptions, setProOptions] = useState({});

    const [projectInput, setProjectInput] = useState([]);

    const getAllRolesAgain = () => {
        getRoles().then((value) => {
            setAllRoles(value)
        })
    }

    if (allRoles.length < 1) {
        getAllRolesAgain()
    }

    if (allProjects.length < 1) {
        getProjects().then((value) => {
            setAllProjects(value)
        })
    }

    const genProjectOptions = (project) => {
        let options = []
        project.map((data, index) => {
            options[index] = {value: data.name, label: data.name}
        })

        return options
    }

    const genAddOptions = (role) => {
        let options = []
        let index = 0
        allProjects.map((all) => {
            let projectNames = []
            role.project.map((p, pIndex) => {
                projectNames[pIndex] = p.name
            })
            if (!projectNames.includes(all.name)) {
                options[index] = {value: all.name, label: all.name}
            }
        })

        return options
    }

    const handleClosePopup = () => {
        if (isPopup) {
            setIsPopup(!isPopup)
        } else if (isAdd) {
            setIsAdd(!isAdd)
        }

        setClickedRole({})
        setNewRoleName("")
        setProOptions({})
        setProjectInput([])
    }

    const handleEditBtn = (role) => {
        setIsPopup(!isPopup)
        setClickedRole(role)
        setNewRoleName(role.name)
        setProOptions(genProjectOptions(role.project))
    }

    const handleAddBtn = (role) => {
        setIsAdd(!isAdd)
        setClickedRole(role)
        setProOptions(genAddOptions(role))
    }

    const handleDeleteBtn = async (role) => {
        setIsLoading(true)
        const roleDoc = doc(db, "roles", role.id);
        await deleteDoc(roleDoc);
        setIsLoading(false)
        getAllRolesAgain()
        // window.location.reload()
    }

    function popupAdd() {
        return (isAdd) ? (
            <div>
                <Modal show={true} onHide={(e)=>{handleClosePopup()}}>
                    <Modal.Header>
                        <Modal.Title>Add Projects <i onClick={(e) => handleClosePopup()} style={{cursor:"pointer", marginLeft:"270px"}} className='fa fa-times'/></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
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
                                        options={proOptions}
                                        onChange={(event) => {
                                            setProjectInput(event)
                                        }}
                                    />
                                </div>
                            </Form.Group>
                            
                            {(projectInput.length > 0) ? (
                                <Form.Group className="mb-3">
                                    {projectInput.map((pro) => {
                                        let subMenuOptions = []
                                        allProjects.map((all) => {
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
                        <Button variant="secondary" onClick={(e) => {handleClosePopup()}}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={(e) =>{}}>
                            Add Permission
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        ) : "";
    }

    function popupEdit() {
    
        return (isPopup) ? (
          <div>
            <Modal show={true} onHide={(e)=>{handleClosePopup()}}>
              <Modal.Header>
                <Modal.Title>Edit Permission <i onClick={(e) => handleClosePopup()} style={{cursor:"pointer", marginLeft:"270px"}} className='fa fa-times'/></Modal.Title>
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
                        <Form.Label>Select Projects</Form.Label>
                        <div className="mb-3">
                            <Select
                                closeMenuOnSelect={true}
                                components={animatedComponents}
                                isMulti
                                options={proOptions}
                                onChange={(event) => {
                                    setProjectInput(event)
                                }}
                            />
                        </div>
                    </Form.Group>

                    {(projectInput.length > 0) ? (
                        <div>
                            {projectInput.map((pro) => {
                                let subOptions = []
                                let defOptions = []
                                
                                // Set subMenu in allProjects to format => {value: "", label: ""} and keep at subOptions
                                allProjects.map((p) => {
                                    if (pro.value === p.name) {
                                        p.subMenu.map((subM, subMIndex) => {
                                            subOptions[subMIndex] = {value: subM, label: subM}
                                        })
                                    }
                                })

                                // Set subMenu in clickedRole(value from edit btn) to format => {value: "", label: ""} and keep at defOptions
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
                <Button variant="secondary" onClick={(e) => {handleClosePopup()}}>
                  Close
                </Button>
                <Button variant="primary" onClick={(e) =>{}}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        ) : "";
      }

    return (
        <div className='content-wrapper'>
            <Loading isLoading={isLoading} />
            {popupAdd()}
            {popupEdit()}
            <div className='permission'>
                <div className='top'>
                    <h2 className='topic'>Permission</h2>
                    <div className='create'>
                        <button className="btn create-btn" ><a href='/CreatePermission'>Create New Permission</a></button>
                    </div>
                </div>
                <Table striped bbordered>
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Role Name</th>
                            <th>Projects {'('}Sub Menu{')'}</th>
                            <th>Commands</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allRoles.map((role,index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{role.name}</td>
                                    <td>{role.project.map((project) => {
                                        return <div>{project.name} {'('}{project.subMenu.map((sub, subIndex) => {
                                            if (subIndex > 0) {
                                                return `, ${sub}`
                                            } else {
                                                return ` ${sub}`
                                            }
                                        })} {')'}</div>
                                    })}
                                    </td>
                                    <td>
                                        <Button className="btn m-2 edit" onClick={(e) => {handleEditBtn(role)}}>Edit</Button>
                                        <Button className="btn m-2 add" onClick={(e) => {handleAddBtn(role)}}>Add Projects</Button><br/>
                                        <button className="btn m-2 del" onClick={(e) => {handleDeleteBtn(role)}}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
