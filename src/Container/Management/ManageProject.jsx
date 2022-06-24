import React, {useState,useEffect}from 'react';
import { authSec, db } from '../../firebaseSec';
import {Modal, Form, Button, InputGroup, FormControl}  from 'react-bootstrap';
// import Table from 'react-bootstrap';
import "./signup.css";
import Chip from '@mui/material/Chip';
import ChipInput from 'material-ui-chip-input'
import Loading from '../../components/Loading';

import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    setDoc,
    arrayUnion,
    arrayRemove
  } from "firebase/firestore";
  
  
const ManageProject = () => {
    const [newProjectName,setNewProjectName] = useState("")
    const [newSubM,setNewSubM] = useState([])
    const [changeProject,setChangeProject] = useState(null)

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [projectInfo, setProjectInfo] = useState({ name: ''});
    const [submenu, setSubmenu] = useState([])

    const [projects, setProjects] = useState([]);
    const projectsCollectionRef = collection(db, "projects");

    const [roles, setRoles] = useState([]);
    const rolesCollectionRef = collection(db, "roles");

    const AdminDoc = doc(db, "roles", '9OJ53QcrH2aHr5hnPuL5');
    

    const getProjects = async () => {
        const data = await getDocs(projectsCollectionRef);
        setProjects(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    if (projects.length==0){ 
        getProjects()
    }

    const getRoles = async () => {
        const data = await getDocs(rolesCollectionRef);
        setRoles(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    if (projects.length==0){ 
        getRoles()
    }

    const addProjects = async (e) => {
        e.preventDefault();

        setIsLoading(true)
        
        var NewProject ={
            name: projectInfo.name,
            subMenu: submenu[submenu.length-1],
        }

        await addDoc(collection(db, "projects"), NewProject);
        roles.map((role) =>{ 
            if(role.name == 'Admin'){
                updateDoc(AdminDoc,{
                    project: arrayUnion(NewProject)
                });
            }       
        });

        window.location.reload()
        setIsLoading(false)
    }

    const deleteProjects = async (project) => {
        const userDoc = doc(db, "projects", project.id);

        setIsLoading(true)

        var DelProjectDetails = {
            name: project.name,
            subMenu: project.subMenu
        }
        await deleteDoc(userDoc);
        console.log("delete",project.id)

        roles.map((role) =>{ 
            if(role.name == 'Admin'){
                updateDoc(AdminDoc,{
                    project: arrayRemove(DelProjectDetails)
                }); 
                console.log("delete from admin",role.id)
            }       
        });
       
        getProjects()
        setIsLoading(false)
    }

    const editProject = async (project) =>{

        setIsLoading(true)
        console.log("edit",project.id)
        setIsOpen(!isOpen)
        const projectDoc = doc(db, "projects", project.id);
    
        await updateDoc(projectDoc, {
            "name": newProjectName,
            "subMenu": submenu[submenu.length - 1] 
        });

        roles.map((role) =>{ 
            if(role.name == 'Admin'){
               
                updateDoc(AdminDoc,{
                    project: arrayRemove({
                        name: project.name,
                        subMenu: project.subMenu
                    })
                });  
                console.log("delete")
                updateDoc(AdminDoc,{
                    project: arrayUnion({
                        name: newProjectName,
                        subMenu: submenu[submenu.length - 1] 
                    })
                });   
                console.log("add")
            }    
            
                       
        });
        getProjects()
        setIsLoading(false)
    }

    const handleChip = (value) => {
        // console.log(value)
        const chips = submenu.slice();
        chips.push(value);
        setSubmenu(chips);
        console.log(chips,submenu);
    };

    const handleEdit = (project) => {
        setIsOpen(!isOpen)
        setNewProjectName(project.name)
        setNewSubM(project.subMenu)
        setChangeProject(project)
        console.log()
    }


    function popup() {
        return (isOpen) ? (
            <div>
            <Modal show={true} onHide={(e)=>{setIsOpen(!isOpen)}}>
                <Modal.Header>
                <Modal.Title>Edit Project<i onClick={(e) => setIsOpen(!isOpen)} style={{cursor:"pointer", marginLeft:"320px"}} className='fa fa-times'/></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        autoFocus
                    />
                    </Form.Group>
                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                    >
                    <ChipInput 
                        style={{paddingTop: "10px",width: "100%",}}
                        classes="class1 class2"
                        defaultValue={newSubM}
                        chips={submenu}
                        onChange={(chips) => handleChip(chips)}                  
                   />
                    </Form.Group>
                </Form>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={(e) => setIsOpen(!isOpen)}>
                    Close
                </Button>
                <Button variant="primary" onClick={(e) => editProject(changeProject)}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
            </div>
        ) : "";
    }
    
    return (
        
        <div className="content-wrapper" style={{padding:"20px 20px"}}>
            <Loading isLoading={isLoading} />
            <form >
                <div class="form-group row">
                    <div class="col-xs-2">
                        <label for="ex1">Project Management</label>
                        <input 
                            class="form-control" 
                            id="ex1" 
                            type="text" 
                            onChange={(event) => {
                                setProjectInfo({ ...projectInfo, name: event.target.value })
                            }}
                        />
                    </div>
                    <ChipInput 
                        style={{paddingTop: "10px",width:"97%",marginLeft:"20px"}}
                        classes="class1 class2"
                        chips={submenu}
                        onChange={(chips) => handleChip(chips)}

                    />
                    <button className="btn" type="submit" onClick={(e)=>addProjects(e)} style={{marginTop: "15px"}}> Create User</button> 
                </div>
            </form>
            {popup()}
            <table className="table " style={{paddingTop: "10px"}}>
                <thead>
                    <tr className="border align-items-center ">
                        <th>Project ID</th>
                        <th>Project Name</th>
                        <th>Submenu</th>
                        <th>Function</th>
                    </tr>
                </thead>
                {projects?.map((project,index) =>{return(
                    <tbody>
                        <tr className="border align-items-center ">
                            <td>{index+1}</td>
                            <td>{project.name}</td>      
                            <td>
                                {project.subMenu?.map((submenu,index) =>{ return(
                                    <>
                                        <Chip label={submenu} clickable />
                                        <div></div>
                                    </>
                                ) })}   
                            </td>
                            <td>
                                <i 
                                    class="fa fa-trash" 
                                    aria-hidden="true" 
                                    style={{cursor: "pointer"}}
                                    onClick={(e)=>deleteProjects(project)}
                                >
                                </i>
                                <Button variant="secondary" onClick={(e) =>handleEdit(project) }>
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                )})} 
            </table>           
        </div>
    );
}

export default ManageProject;
