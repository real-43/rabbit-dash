import React, { Profiler, useCallback, useEffect, useState} from 'react'
import {Form, Button}  from 'react-bootstrap';
import './ManagePermission.css'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

export default function ManagePermission() {

    // const [projectInput, setProjectInput] = useState([]);
    const [data, setdata] = useState(null);

    const mockupRole = {
        name: "staff", 
        project: [
            {
                name: "Datafile", 
                subMenu: ["Home", "PDF"]
            },
            {
                name: "Maintenance Fee", 
                subMenu: ["HealthCheck", "Logs"]
            }
        ]}

    const mockupProject = [
        {
            name: "Datafile",
            subMenu: ["Home", "PDF", "Setting", "Notification"]
        },
        {
            name: "Maintenance Fee",
            subMenu: ["HealthCheck", "Logs"]
        }
    ]

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

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const animatedComponents = makeAnimated();

    const subMenuOptions = (event) => {
        // setProjectInput(event)
        var filteredProject = [{name: "", options: [{value: "", label: ""}]}]
        var index = 0
        console.log("out out",event)
        event.map((inp) => {
            console.log("out")
            mockupProject.map((moc) => {
                console.log("in")
                var option = []
                var indexOption = 0
                // if project in input
                if (inp.value === moc.name) {
                    moc.subMenu.map((sub) => {
                        option[indexOption] = {value: sub, label: sub}
                        indexOption = indexOption + 1
                    })
                    filteredProject[index] = {name: inp.value, options: option}
                    index = index + 1
                }
            })
        })
        
        setdata(filteredProject)
        console.log("data", data, filteredProject)
    }
    return (
        <div className='content-wrapper'>
            <div className='ManagePermission'>
                <div className='create-permission'>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Permission Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" onChange={(e) => {}} />
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
                                        subMenuOptions(event)
                                    }}
                                />
                            </div>
                        </Form.Group>
                        {(data !== null) ? (
                            data.map((project) => {
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Sub Menu of {project.name}</Form.Label>
                                    <div className="mb-3">
                                        <Select
                                            closeMenuOnSelect={false}
                                            components={animatedComponents}
                                            isMulti
                                            options={project.options}
                                            onChange={(event) => {
                                                
                                            }}
                                        />
                                    </div>
                                </Form.Group>
                            })
                        ) : ""}
                       
                        <Button onClick={(e) => handleSubmit()} variant="primary" type="submit">
                            Create
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}
