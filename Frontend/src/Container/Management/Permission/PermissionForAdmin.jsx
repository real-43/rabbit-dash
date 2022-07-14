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
import ConfirmDelete from '../ConfirmDelete';
import AddProject from './Components/AddProject';
import EditPermission from './Components/EditPermission';


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
    const [isDel, setIsDel] = useState(false);

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
                index += 1
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
        setProOptions(genAddOptions(role))
        setClickedRole(role)
        setIsAdd(true)
    }

    const handleDeleteBtn = (role) => {
        setClickedRole(role)
        setIsDel(true)
    }

    const handleCloseDel = () => {
        setIsDel(false)
        setClickedRole([])
    }

    const deleteRole = async () => {
        setIsLoading(true)

        setIsDel(false)

        let rest = []
        allRoles.map((r) => {
            if(r.name !== clickedRole.name) {
                rest.push(r)
            }
        })

        const roleDoc = doc(db, "roles", clickedRole.id);
        await deleteDoc(roleDoc);
        
        setAllRoles(rest)

        // Delete the role from all users in firebase
        allUsers.map((user) => {
            if (user.role === clickedRole.name) {
                const docRef = doc(db, "users", user.id)
                updateDoc(docRef, {
                    "role" : "",
                })
            }
        })

        getAllRolesAgain()
        handleCloseDel()
        setIsLoading(false)
    }

    return (
        <div className='content-wrapper'>
            <Loading isLoading={isLoading} />
            {(isAdd) ? (
                <AddProject 
                    onClose={() => setIsAdd(false)}
                    clickedRole={clickedRole}
                    proOptions={proOptions}
                    allProjects={allProjects}
                />
            ) : ""}
            {(isPopup) ? (
                <EditPermission 
                    onClose={() => setIsPopup(false)}
                    clickedRole={clickedRole}
                    proOptions={proOptions}
                    allProjects={allProjects}
                />
            ) : ""}
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
