import React, { useState } from 'react'
import {Form, Button}  from 'react-bootstrap';
import './ManagePermission.css'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { collection, addDoc } from "firebase/firestore"; 
import { auth, db } from '../../firebase';
import { getProjects, getUser, getRole } from '../../MyFireStore';
import { useNavigate } from 'react-router'
import Loading from '../../components/Loading';
import { set } from 'date-fns';


export default function CreatePermission() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState();

    const [currentUser, setCurrentUser] = useState([]);
    const [currentUserRole, setCurrentUserRole] = useState([]);
    const user = auth.currentUser

    // data to in input to create new permission
    const [roleName, setRoleName] = useState("");
    const [projectInput, setProjectInput] = useState([]);
    const [data, setdata] = useState([]);
    const [options, setOptions] = useState([]);

    const [allProjects, setAllProjects] = useState([]);
    const [toSend, setToSend] = useState([]);

    const optionsProject = () => {
        let pName = currentUserRole.project[0].name
        console.log("pName", pName)
        setOptions([{value: pName, label: pName}])
    }

    const getCurrentUser = () => {
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true)

        var update = [...toSend]
        setToSend(update)

        await addDoc(collection(db, "roles"), {
            name: roleName,
            project: toSend
        });
        setIsLoading(false)
        window.location.reload()
    }

    const animatedComponents = makeAnimated();

    const handleChange = (event) => {
        setProjectInput(event)
        console.log("event", event)
        if (event.length < 1) {
            setToSend([])
        }
    }

    const subMenuOptions = (event) => {
        var filteredProject = [{name: "", options: [{value: "", label: ""}]}]
        var index = 0
        event.map((inp) => {
            
            allProjects.map((moc) => {
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

    if (currentUser.length < 1) {
        getCurrentUser()
        console.log("getCurrentUser")
    } else {
        console.log("CurrentUserRole", currentUserRole.length)
            if (allProjects.length === 0) {
                getProjects().then((value) => {
                    setAllProjects(value)
            })
            
            if (currentUserRole.length !== 0 && options.length < 1) {
                console.log("dododo")
                optionsProject()
            }
        }
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
                            <Form.Control type="text" placeholder="Name" onChange={(e) => {setRoleName(e.target.value)}} />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Select Projects</Form.Label>
                            <div className="mb-3">
                                <Select
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    options={options}
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
                                                        console.log("tosend", toSend)
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
