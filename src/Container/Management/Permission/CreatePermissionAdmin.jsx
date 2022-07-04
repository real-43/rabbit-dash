import React, { useState } from 'react'
import {Form, Button}  from 'react-bootstrap';
import './ManagePermission.css'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { collection, addDoc, onSnapshot } from "firebase/firestore"; 
import { db } from '../../../firebase';
import { useNavigate } from 'react-router'
import Loading from '../../../components/Loading';
import { useSelector, useDispatch } from 'react-redux';
import { defindAllRoles } from '../../../firebaseSlice';


export default function CreatePermission() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState();

    const [roleName, setRoleName] = useState("");
    const [projectInput, setProjectInput] = useState([]);
    const [data, setdata] = useState([]);
    const mockupProject = useSelector((state) => state.firebase.allProjects);
    const [toSend, setToSend] = useState([]);

    const optionsProject = () => {
        var names = []
        var index = 0
        mockupProject.map((p) => {
            names[index] = {value: p.name, label: p.name}
            index = index + 1
        })
        return names
    }

    const getProjectName = (project) => {
        let menuName = []
        project.map((p, index) => {
            menuName[index] = p.name
        })
        return menuName
    }

    const updateData = async () => {
        setIsLoading(true)
        onSnapshot(collection(db,"roles"),(function(querySnapshot) {
            let roles = [];
            querySnapshot.forEach(function(doc) {
                roles.push({...doc.data(), id: doc.id});
            });
            dispatch(defindAllRoles(roles))
        }));
        setIsLoading(false)
    }

    const reset = () => {
        setdata([])
        setProjectInput([])
        setRoleName("")
        setToSend([])
    }

    const handleSubmit = async (event) => {
        setIsLoading(true)
        event.preventDefault();
        let manageChild = getProjectName(toSend)

        var update = [...toSend]
        setToSend(update)

        addDoc(collection(db, "roles"), {
            name: roleName,
            project: toSend,
            Management: {Permission: manageChild, Project: manageChild, Services: manageChild}
        });

        updateData()
        reset()
        setIsLoading(false)
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
                                If the name includes "Admin" they can manage their project
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