import React, { useState, useEffect } from 'react'
import {Form, Button}  from 'react-bootstrap';
import './ManagePermission.css'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { collection, addDoc } from "firebase/firestore"; 
import { db, auth } from '../../../Firebase Config/firebase';
import { useNavigate } from 'react-router'
import Loading from '../../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { addTask } from '../../../Reducer/firebaseSlice';

export default function CreatePermission() {

    const animatedComponents = makeAnimated();
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState();

    const [roleName, setRoleName] = useState("");
    const [projectInput, setProjectInput] = useState([]);
    const [data, setdata] = useState([]);
    const mockupProject = useSelector((state) => state.firebase.allProjects);
    const [toSend, setToSend] = useState([]);

    useEffect(() => {
        const authentication = onAuthStateChanged(auth,(user) => {
            if (user) {
                navigate('/CreatePermissionAdmin')
            } else {
                navigate('/')
           }
        }) 
        
        return authentication
    },[])

    // Create array of options that user can select
    const optionsProject = () => {
        var names = []
        var index = 0
        mockupProject.map((p) => {
            names[index] = {value: p.name, label: p.name}
            index = index + 1
        })
        return names
    }

    // Use when want to get all project name that user selected
    const getProjectName = (project) => {
        let menuName = []
        project.map((p, index) => {
            menuName[index] = p.name
        })
        return menuName
    }

    // reset input
    const reset = () => {
        setdata([])
        setProjectInput([])
        setRoleName("")
        setToSend([])
    }

    // Create role when click create button
    const handleSubmit = async (event) => {
        setIsLoading(true)
        event.preventDefault();

        dispatch(addTask("Create role"))

        let manageChild = getProjectName(toSend)

        var update = [...toSend]
        setToSend(update)

        if (roleName !== "") {
            if (roleName.includes("Admin")) {
                await addDoc(collection(db, "roles"), {
                    name: roleName,
                    project: toSend,
                    Management: {Permission: manageChild, Project: manageChild, Services: manageChild}
                });
            } else {
                await addDoc(collection(db, "roles"), {
                    name: roleName,
                    project: toSend,
                });
            }
        }

        

        reset()
        setIsLoading(false)
    }

    const handleChange = (event) => {
        setProjectInput(event)
        if (event.length < 1) {
            setToSend([])
        }
    }

    // Create array of submenu of projects selected
    const subMenuOptions = (event) => {
        var filteredProject = [{name: "", options: [{value: "", label: ""}]}]
        var index = 0
        event.map((inp) => {
            
            mockupProject.map((moc) => {
                var option = []
                var indexOption = 0
                // if project in input
                if (inp.value === moc.name) {
                    moc.subMenu?.map((sub) => {
                        option[indexOption] = {value: sub, label: sub}
                        indexOption = indexOption + 1
                    })
                    filteredProject[index] = {name: inp.value, options: option}
                    index = index + 1
                }
            })
        })
        setdata(filteredProject)
    }
    
    return (
        <div className='content-wrapper'>
            <Loading isLoading={isLoading} />
            <div className='CreatePermission'>
                <button className='back-btn' >{'<'} <a onClick={() => navigate('/permission')}>Back</a></button>
                <div className='create-permission'>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Permission Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" value={roleName} onChange={(e) => {setRoleName(e.target.value)}} />
                            <Form.Text className="text-muted">
                                The name have to start with project name and end with "Admin" if you want to assign to be admin of the project.
                            </Form.Text>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Select Projects</Form.Label>
                            <div className="mb-3">
                                <Select
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    value={projectInput}
                                    isMulti
                                    options={optionsProject()}
                                    onChange={(event) => {
                                        handleChange(event)
                                        subMenuOptions(event)
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