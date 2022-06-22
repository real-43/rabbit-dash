import React, { useEffect, useState } from 'react'
import {Form, Button}  from 'react-bootstrap';
import './ManagePermission.css'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../../firebase';
import { getProjects } from '../../MyFireStore';


export default function ManagePermission() {

    const [roleName, setRoleName] = useState("");
    const [projectInput, setProjectInput] = useState([]);
    const [data, setdata] = useState([]);
    const [mockupProject, setMockUpProject] = useState([]);
    const toSend = [];

    // const mockupProject = [
    //     {
    //         name: "Datafile",
    //         subMenu: ["Home", "PDF", "Setting", "Notification"]
    //     },
    //     {
    //         name: "Maintenance Fee",
    //         subMenu: ["HealthCheck", "Logs"]
    //     }
    // ]

    const optionsProject = () => {
        var names = []
        var index = 0
        mockupProject.map((p) => {
            names[index] = {value: p.name, label: p.name}
            index = index + 1
        })
        // console.log("input: ", projectInput)
        return names
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        //name: roleName
        //project: toSend
        await addDoc(collection(db, "roles"), {
            name: roleName,
            project: toSend
        });
    }

    const animatedComponents = makeAnimated();

    const handleChange = (event) => {
        setProjectInput(event)
    }

    const subMenuOptions = (event) => {
        var filteredProject = [{name: "", options: [{value: "", label: ""}]}]
        var index = 0
        event.map((inp) => {
            
            mockupProject.map((moc) => {
                console.log("in")
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

    if (mockupProject.length === 0) {
        getProjects().then((value) => {
            setMockUpProject(value)
            console.log(value)
        })
    }
    return (
        <div className='content-wrapper'>
            <div className='ManagePermission'>
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
                                    options={optionsProject()}
                                    onChange={(event) => {
                                        handleChange(event)
                                        subMenuOptions(event)
                                        console.log("something", getProjects())
                                    }}
                                />
                            </div>
                        </Form.Group>
                        {(projectInput.length !== 0) ? (
                            <div>
                            {console.log("data", data)}
                                {data.map((d, index) => {
                                    return (
                                        <Form.Group className="mb-3">
                                            <Form.Label>Select Sub Menu of {d.name}</Form.Label>
                                            <div className="mb-3">
                                                <Select
                                                    closeMenuOnSelect={false}
                                                    components={animatedComponents}
                                                    isMulti
                                                    options={d.options}
                                                    onChange={(event) => {
                                                        var arr = []
                                                        event.map((e, eIndex) => {
                                                            arr[eIndex] = e.value
                                                        })

                                                        toSend[index] = {name: d.name, subMenu: arr}
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
