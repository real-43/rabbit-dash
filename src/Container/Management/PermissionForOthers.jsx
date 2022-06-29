import React, { useState } from 'react'
import { Table } from 'react-bootstrap';
import { getProjects, getRole, getRoles, getUser, getUsers } from '../../MyFireStore';
import { useNavigate } from 'react-router'
import { Modal, Form, Button }  from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { auth, db } from '../../firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Loading from '../../components/Loading';

export default function PermissionForOthers() {

    const animatedComponents = makeAnimated();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState();

    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUser, setCurrentUser] = useState();
    const user = auth.currentUser

    const [allRoles, setAllRoles] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [clickedRole, setClickedRole] = useState({}); // store the role user want to add, edit, delete

    const [isPopup, setIsPopup] = useState(false);
    const [isAdd, setIsAdd] = useState(false);

    const [newRoleName, setNewRoleName] = useState("");

    const [proOptions, setProOptions] = useState({}); // store options to select

    const [projectInput, setProjectInput] = useState([]); // store project options input that user select ex. [{value: "", label: ""}]
    const [projectChange, setProjectChange] = useState([]); // store project that will send to firestore
    
    const getCurrentUserRole = async () => {
        let id = user?.uid
        if (id !== undefined) {
            getUser(id).then((value) => {
                setCurrentUser(value);
                getRole(value.role).then((value) => {
                    setCurrentUserRole(value)
                })
            })
        }
    }

    const getAllUsers = async () => {
        await getUsers().then((value) => {
            setAllUsers(value)
        })
    }

    const getAllRolesAgain = async () => {
        let roles = [...allRoles]
        let index = 0
        if (currentUserRole !== undefined) {
            await getRoles().then((value) => {
            value.map((r) => {
                if (r.name !== "Admin" && r.Management.Permission[0] === currentUserRole?.Management.Permission[0]) {
                    roles[index] = r
                    index += 1
                }
            })
            setAllRoles(roles)
            })
        }

    }

    if (allRoles.length < 1) {
        getAllRolesAgain()
        getCurrentUserRole()
    }

    if (allUsers.length < 1) {
        getAllUsers()
    }

    if (allProjects.length < 1) {
        getProjects().then((value) => {
            setAllProjects(value)
        })
    }

    // create options for user select of edit permission
    const genProjectOptions = (project) => {
        let options = []
        project.map((data, index) => {
            options[index] = {value: data.name, label: data.name}
        })

        return options
    }

    // call when click btn to close all popup
    const handleClosePopup = () => {
        setIsPopup(!isPopup)
        setClickedRole({})
        setNewRoleName("")
        setProOptions({})
        setProjectInput([])
    }

    const handleEditBtn = (role) => {
        let options = genProjectOptions(role.project)
        setIsPopup(!isPopup)
        setClickedRole(role)
        setNewRoleName(role.name)
        setProOptions(options)
        setProjectInput(options)
    }

    const handleSubmitEdit = async () => {
        setIsLoading(true)
        let update = [...projectChange]
        let sendPro = []
        
        // set value to current
        setProjectChange(update)

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

        // update field(name and project) in document roles in firestore
        const docRef = doc(db, "roles", clickedRole.id)
        await updateDoc(docRef, {
            "name" : newRoleName,
            "project" : sendPro
        })

        // get updated value from firestore to display
        await getAllRolesAgain()
        // close popup and set all variable to default
        handleClosePopup()

        setIsLoading(false)
    }

    const handleDeleteBtn = async (role) => {
        setIsLoading(true)

        const roleDoc = doc(db, "roles", role.id);
        await deleteDoc(roleDoc);

        allUsers.map((user) => {
            if (user.role === role.name) {
                const docRef = doc(db, "users", user.id)
                updateDoc(docRef, {
                    "role" : "",
                })
            }
        })

        setIsLoading(false)
        await getAllRolesAgain()
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
                                defaultValue={proOptions}
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
                            {projectInput.map((pro, index) => {
                                let subOptions = []
                                let defOptions = []
                                
                                let projectName = ""
                                // Set subMenu in allProjects to format => {value: "", label: ""} and keep at subOptions
                                allProjects.map((p) => {
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
                <Button variant="primary" onClick={(e) =>{handleSubmitEdit()}}>
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
            {popupEdit()}
            <div className='permission'>
                <div className='top'>
                    <h2 className='topic'>Permission</h2>
                    <div className='create'>
                        <button className="btn create-btn" ><a onClick={() => navigate('/CreatePermissionOthers')}>Create New Permission</a></button>
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
                        {allRoles?.map((role,index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{role.name}</td>
                                    <td>{role?.project.map((project) => {
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
                                        <Button className="btn m-2 edit" onClick={(e) => {handleEditBtn(role)}}>Edit</Button><br/>
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
