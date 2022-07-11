import React, { useState, useEffect } from 'react'
import {Form, Button}  from 'react-bootstrap';
import './ManagePermission.css'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { collection, addDoc } from "firebase/firestore"; 
import { db, auth } from '../../../Firebase Config/firebase';
import { useNavigate } from 'react-router'
import Loading from '../../../components/Loading';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../../../Reducer/firebaseSlice';
import { subMenuOptions } from './functionPermission';

export default function CreatePermissionOthers() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState();
    const dispatch = useDispatch();
    const animatedComponents = makeAnimated();

    const currentUserRole = useSelector((state) => state.firebase.currentRoleFS)
    const currentUser = useSelector((state) => state.firebase.currentUserFS)

    // data to in input to create new permission
    const [roleName, setRoleName] = useState("");
    const [projectInput, setProjectInput] = useState([]);
    const [data, setdata] = useState([]);
    const [options, setOptions] = useState([]);

    const allProjects = useSelector((state) => state.firebase.allProjects)
    const [toSend, setToSend] = useState([]);

    useEffect(() => {
        const authentication = onAuthStateChanged(auth,(user) => {
            if (user) {
                navigate('/CreatePermissionOthers')
            } else {
                navigate('/')
           }
        }) 
        
        return authentication
    },[])

    const optionsProject = () => {
        let pName = currentUserRole.project[0].name
        setOptions([{value: pName, label: pName}])
    }

    const inputToDefault = () => {
        setRoleName("")
        setProjectInput([])
        setdata([])
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true)

        dispatch(addTask("Create role"))

        var update = [...toSend]
        setToSend(update)

        if (roleName !== "") {
            await addDoc(collection(db, "roles"), {
                name: roleName,
                project: toSend,
            });
        }
            
        inputToDefault()
        setIsLoading(false)
    }

    const handleChange = (event) => {
        setProjectInput(event)
        if (event.length < 1) {
            setToSend([])
        }
    }

    if (currentUserRole.length !== 0 && options.length < 1) {
        optionsProject()
    }
    

    return (
        <div className='content-wrapper'>
            <Loading isLoading={isLoading} />
            <div className='CreatePermission'>
                <button className='back-btn' >{'<'} <a onClick={() => {
                    if (currentUser.role === "Admin") {
                        navigate("/permission")
                    }else {
                        navigate("/permissionOthers")
                    }
                }}>Back</a></button>
                <div className='create-permission'>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Permission Name</Form.Label>
                            <Form.Control type="text" value={roleName} placeholder="Name" onChange={(e) => {setRoleName(e.target.value)}} />
                            <Form.Text className="text-muted">
                                Project name have to be prefix.
                            </Form.Text>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Select Projects</Form.Label>
                            <div className="mb-3">
                                <Select
                                    value={projectInput}
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    options={options}
                                    onChange={(event) => {
                                        handleChange(event)
                                        setdata(subMenuOptions(event, allProjects))
                                    }}
                                />
                            </div>
                        </Form.Group>
                        {(projectInput.length !== 0) ? (
                            <div>
                                {data.map((d, index) => {
                                    return (
                                        <Form.Group key={d.name} className="mb-3">
                                            <Form.Label>Select Sub Menu of {d.name}</Form.Label>
                                            <div className="mb-3">
                                                <Select
                                                    closeMenuOnSelect={false}
                                                    components={animatedComponents}
                                                    isMulti
                                                    options={d.options}
                                                    onChange={(event) => {
                                                        var arrSubMenu = []
                                                        var addSub = [...toSend]
                                                        event.map((e, eIndex) => {
                                                            arrSubMenu[eIndex] = e.value
                                                        })
                                                        addSub[index] = {name: d.name, subMenu: arrSubMenu}
                                                        setToSend(addSub)
                                                    }}
                                                />
                                            </div>
                                        </Form.Group>
                                    )
                                })}
                            </div>
                        ) : ""}
                       
                        <Button onClick={(e) => handleSubmit(e)} variant="primary" type="submit">
                            Create
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}
