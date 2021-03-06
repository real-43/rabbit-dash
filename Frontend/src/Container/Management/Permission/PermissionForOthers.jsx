import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router'
import { Modal, Form, Button }  from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { db, auth } from '../../../Firebase Config/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Loading from '../../../components/Loading';
import './ManagePermission.css'
import { useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import ConfirmDelete from '../ConfirmDelete';

export default function PermissionForOthers() {

    const animatedComponents = makeAnimated();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState();
    const [isData, setIsData] = useState(false);

    const currentUserRole = useSelector((state) => state.firebase.currentRoleFS)
    const allRolesR = useSelector((state) => state.firebase.allRoles)
    const allProjectsR = useSelector((state) => state.firebase.allProjects)
    const allUsersR = useSelector((state) => state.firebase.allUsers)

    const [allRoles, setAllRoles] = useState([...allRolesR])
    const [allProjects, setAllProjects] = useState([...allProjectsR]);
    const [allUsers, setAllUsers] = useState([...allUsersR]);
    const [rolesInSamePro, setRoleInSamePro] = useState([])
    const [clickedRole, setClickedRole] = useState({}); // store the role user want to add, edit, delete

    const [isPopup, setIsPopup] = useState(false);
    const [isDel, setIsDel] = useState(false);

    const [newRoleName, setNewRoleName] = useState("");

    const [proOptions, setProOptions] = useState({}); // store options to select

    const [projectInput, setProjectInput] = useState([]); // store project options input that user select ex. [{value: "", label: ""}]
    const [projectChange, setProjectChange] = useState([]); // store project that will send to firestore

    useEffect(() => {
        const authentication = onAuthStateChanged(auth,(user) => {
            if (user) {
                navigate('/permissionOthers')
            } else {
                navigate('/')
           }
        }) 
        
        return authentication
    },[])

    // update allRoles when allRoles in redux change
    useEffect(() => {
        setAllRoles([...allRolesR])
    }, [allRolesR])

    const getSameRolesAgain = async () => {
        let roles = []
        let index = 0
        if (currentUserRole !== undefined) {
            allRoles.map((r) => {
                if (r.name !== "Admin" && r?.name?.toLowerCase().includes(currentUserRole.name.split("Admin")[0].toLowerCase())) {
                    roles[index] = r
                    index += 1
                }
            })
            setRoleInSamePro(roles)
        }

    }

    if (!isData) {
        setIsData(true)
        getSameRolesAgain()
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
        setIsPopup(false)
        setClickedRole({})
        setNewRoleName("")
        setProOptions({})
        setProjectInput([])
    }

    const handleCloseDel = () => {
        setIsDel(false)
        setClickedRole([])
    }

    const handleEditBtn = (role) => {
        let options = genProjectOptions(role.project)
        setIsPopup(true)
        setClickedRole(role)
        setNewRoleName(role.name)
        setProOptions(options)
        setProjectInput(options)
    }

    const handleDeleteBtn = (role) => {
        setClickedRole(role)
        setIsDel(true)
    }

    const handleSubmitEdit = async () => {
        setIsLoading(true)
        let update = [...projectChange]
        let sendPro = []
        
        // set value to current
        setProjectChange(update)
        setIsPopup(false)
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
        
        setIsLoading(false)
        // close popup and set all variable to default
        handleClosePopup()
    }

    const deleteRole = async () => {
        setIsLoading(true)
        
        setIsDel(false)

        const roleDoc = doc(db, "roles", clickedRole.id);
        await deleteDoc(roleDoc);

        setIsLoading(false)

        allUsers.map((user) => {
            if (user.role === clickedRole.name) {
                const docRef = doc(db, "users", user.id)
                updateDoc(docRef, {
                    "role" : "",
                })
            }
        })
        
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
            {(isDel) ? (
                <ConfirmDelete
                    onClose={() => setIsDel(false)}
                    topic="Permission"
                    onConfirm={() => deleteRole()}
                />
            ) : ""}
            <div className='permission'>
                <div className='top'>
                    <h2 className='topic'>Permission</h2>
                    <div className='create'>
                        <button className="create-btn" ><a onClick={() => navigate('/CreatePermissionOthers')}>Create New Permission</a></button>
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
                        {rolesInSamePro?.map((role,index) => {
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
                                        <Button className="btn m-2 edit" onClick={(e) => {handleEditBtn(role)}}>Edit</Button>
                                        <button className="m-2 del" onClick={(e) => {handleDeleteBtn(role)}}>Delete</button>
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
