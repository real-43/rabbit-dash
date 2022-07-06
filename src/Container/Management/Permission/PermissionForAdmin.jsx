import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router'
import { Modal, Form, Button }  from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { db, auth } from '../../../Firebase Config/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Loading from '../../../components/Loading';
import { useSelector, useDispatch } from 'react-redux';
import { defindAllRoles } from '../../../Reducer/firebaseSlice';
import { collection, onSnapshot } from "firebase/firestore";
import './ManagePermission.css';
import { onAuthStateChanged } from 'firebase/auth';


export default function Permission() {

    const animatedComponents = makeAnimated();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState();

    const allRolesR = useSelector((state) => state.firebase.allRoles)
    const allProjectsR = useSelector((state) => state.firebase.allProjects)
    const allUsersR = useSelector((state) => state.firebase.allUsers)

    const [allRoles, setAllRoles] = useState([...allRolesR]);
    const [allProjects, setAllProjects] = useState([...allProjectsR]);
    const [allUsers, setAllUsers] = useState([...allUsersR]);

    const [clickedRole, setClickedRole] = useState({}); // store the role user want to add, edit, delete

    const [isPopup, setIsPopup] = useState(false);
    const [isAdd, setIsAdd] = useState(false);

    const [newRoleName, setNewRoleName] = useState("");

    const [proOptions, setProOptions] = useState({}); // store options to select

    const [projectInput, setProjectInput] = useState([]); // store project options input that user select ex. [{value: "", label: ""}]
    const [projectChange, setProjectChange] = useState([]); // store project that will send to firestore

    useEffect(() => {
        const authentication = onAuthStateChanged(auth,(user) => {
            if (user) {
                navigate('/permission')
            } else {
                navigate('/')
           }
        }) 
        
        return authentication
    },[])

    const getAllRolesAgain = async () => {
        onSnapshot(collection(db,"roles"),(function(querySnapshot) {
            let roles = [];
            querySnapshot.forEach(function(doc) {
                roles.push({...doc.data(), id: doc.id});
            });
            dispatch(defindAllRoles(roles))
        }));
    }

    useEffect(() => {
        setAllRoles([...allRolesR])
    }, [allRolesR])

    // create options for user select of edit permission
    const genProjectOptions = (project) => {
        let options = []
        project.map((data, index) => {
            options[index] = {value: data.name, label: data.name}
        })

        return options
    }

    // create options for user select of add permission
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

    // call when click btn to close all popup
    const handleClosePopup = () => {
        if (isPopup) {
            setIsPopup(false)
        } else if (isAdd) {
            setIsAdd(!isAdd)
        }

        setClickedRole({})
        setNewRoleName("")
        setProOptions({})
        setProjectInput([])
    }

    const handleEditBtn = (role) => {
        let options = genProjectOptions(role.project)
        setIsPopup(true)
        setClickedRole(role)
        setNewRoleName(role.name)
        setProOptions(options)
        setProjectInput(options)
    }

    const handleAddBtn = (role) => {
        setIsAdd(true)
        setClickedRole(role)
        setProOptions(genAddOptions(role))
    }

    const handleSubmitAdd = async () => {
        setIsLoading(true)
        setIsAdd(false)
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

        let rest = []
        allRoles.map((r) => {
            if (r.name === clickedRole.name) {
                rest.push({...r, project: sendPro})
            } else {
                rest.push(r)
            }
        })

        // update field(project) in firestore
        const docRef = doc(db, "roles", clickedRole.id)
        await updateDoc(docRef, {
            "project" : sendPro
        })

        setAllRoles(rest)

        // getAllRolesAgain()
        handleClosePopup()
        setIsLoading(false)
    }

    const handleSubmitEdit = async () => {
        setIsLoading(true)
        setIsPopup(false)
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

        let rest = []
        allRoles.map((r) => {
            if (r.name === clickedRole.name) {
                rest.push({...r, project: sendPro, name: newRoleName})
            } else {
                rest.push(r)
            }
        })

        // update field(name and project) in document roles in firestore
        const docRef = doc(db, "roles", clickedRole.id)
        await updateDoc(docRef, {
            "name" : newRoleName,
            "project" : sendPro
        })

        setAllRoles(rest)

        // get updated value from firestore to display
        // getAllRolesAgain()
        // close popup and set all variable to default
        handleClosePopup()
        setIsLoading(false)
    }

    const handleDeleteBtn = async (role) => {
        setIsLoading(true)

        let rest = []
        allRoles.map((r) => {
            if(r.name !== role.name) {
                rest.push(r)
            }
        })

        const roleDoc = doc(db, "roles", role.id);
        await deleteDoc(roleDoc);
        
        setAllRoles(rest)

        // Delete the role from all users in firebase
        allUsers.map((user) => {
            if (user.role === role.name) {
                const docRef = doc(db, "users", user.id)
                updateDoc(docRef, {
                    "role" : "",
                })
            }
        })

        getAllRolesAgain()
        setIsLoading(false)
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
                                    {projectInput.map((pro, index) => {
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
                        <Button variant="secondary" onClick={(e) => {handleClosePopup()}}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={(e) =>{handleSubmitAdd()}}>
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
            {popupAdd()}
            {popupEdit()}
            <div className='permission'>
                <div className='top'>
                    <h2 className='topic'>Permission</h2>
                    <div className='create'>
                        <button className="create-btn" ><a onClick={() => navigate('/CreatePermissionAdmin')}>Create New Permission</a></button>
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
