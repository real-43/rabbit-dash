import React, {useState}from 'react';
import { db } from '../../firebaseSec';
import { auth } from '../../firebase';
import {Modal, Form, Button}  from 'react-bootstrap';
// import Table from 'react-bootstrap';
import "./signup.css";
import Chip from '@mui/material/Chip';
import ChipInput from 'material-ui-chip-input'
import Loading from '../../components/Loading';
import Stack from '@mui/material/Stack';
import * as GG from '../../MyFireStore';
import {useSelector} from "react-redux"

import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    getDoc,
    arrayUnion,
    arrayRemove,
    where, query
  } from "firebase/firestore";

const ManageProject = () => {

    const user = auth.currentUser 
    
    const [newProjectName,setNewProjectName] = useState("")
    const [newSubM,setNewSubM] = useState([])
    const [changeProject,setChangeProject] = useState(null)

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //handle input 
    const [projectInfo, setProjectInfo] = useState({ name: ''});
    const [submenu, setSubmenu] = useState([])

    const [projects, setProjects] = useState(useSelector((state)=> state.firebase.allProjects)); //useSelector((state) => state.firebase.currentUser)

    const [roles, setRoles] = useState(useSelector((state) => state.firebase.allRoles));
    

    const AdminDoc = doc(db, "roles", 'z0M3C6Jdl1AHlZmk7egb');

    const userinfo = useSelector((state) => state.firebase.currentUserFS)
    

    const addProjects = async (e) => {
        e.preventDefault();

        setIsLoading(true)
        
        var NewProject ={
            name: projectInfo.name,
            subMenu: submenu[submenu.length-1],
        }

        await addDoc(collection(db, "projects"), NewProject);
        roles.map((role) =>{ 
            if(role.name === 'Admin'){
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
            // console.log(role.id)
            const roleDoc = doc(db, "roles", role.id)
            role.project?.map((submenu) =>{
                // console.log(submenu.name)
                if(submenu.name === project.name){
                    // console.log(submenu.name)
                    updateDoc(roleDoc,{
                        project: arrayRemove(DelProjectDetails)
                    });
                }      
            })
                
        }); 
        
        setIsLoading(false)
    }

    const editProject = async (project) =>{

        setIsLoading(true)
        console.log("edit", project.id)
        setIsOpen(!isOpen)
        const projectDoc = doc(db, "projects", project.id);
    
        await updateDoc(projectDoc, {
            "name": newProjectName,
            "subMenu": submenu[submenu.length - 1] 
        });

        roles.map((role) =>{ 
            const roleDoc = doc(db, "roles", role.id)
            role.project?.map((proJ) =>{
                // console.log(submenu.name)
                if(proJ.name === project.name){
                    updateDoc(roleDoc, {
                        "name" : project.name,
                        "project": {name: project.name, subMenu: project.subMenu},
                        "Management": {Permission: project.name, Project: project.name, Services: project.name}
                    })
                    console.log("add")
                }    
            })
                       
        });
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
    const [projectName,setProjectName] =  useState([])

    const getProjectPermission = () =>{

       
       
        roles.map(permission =>{
            // console.log(permission.Management.Project)  
            if (permission.name === userinfo.role){ 
                        
                setProjectName(permission.Management.Project)
                
            }
        })
        
    } 
    if (projectName.length===0 && user !== null){
        getProjectPermission()
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
        
        <div className="content-wrapper">
            <Loading isLoading={isLoading} />
            <div className='manage-project'>
                <form >
                    <div class="form-group row">
                        <div class="col-xs-2">
                            <label for="ex1" style={{paddingBottom: '20px'}}>Project Management</label>
                            <input 
                                class="form-control" 
                                id="ex1" 
                                type="text" 
                                onChange={(event) => {
                                    setProjectInfo({ ...projectInfo, name: event.target.value })
                                }}
                                placeholder="Project Name"
                                
                            />
                        </div>
                        <ChipInput 
                            style={{paddingTop: "10px",width:"97.5%",marginLeft:"20px"}}
                            chips={submenu}
                            onChange={(chips) => handleChip(chips)}
                            placeholder="Submenu..."

                        />
                        <button className="btn" type="submit" onClick={(e)=>addProjects(e)} style={{marginTop: "15px"}}> Create Project</button> 
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
                    {projects.filter(project => projectName.includes(project.name)).map((filproject,index) =>{return(
                        <tbody>
                            <tr className="border align-items-center ">
                                <td>{index+1}</td>
                                <td>{filproject.name}</td>      
                                <td>
                                    <Stack direction="row" spacing={1}>
                                        {filproject.subMenu?.map((submenu,index) =>{ return(
                                            <Chip label={submenu} clickable/>
                                        ) })}  
                                    </Stack> 
                                </td>
                                <td>
                                    <i 
                                        class="fa fa-trash" 
                                        aria-hidden="true" 
                                        style={{cursor: "pointer"}}
                                        onClick={(e)=>deleteProjects(filproject)}
                                    >
                                    </i>
                                    <i 
                                        class="fa fa-cogs" 
                                        aria-hidden="true" 
                                        style={{
                                            cursor: "pointer",
                                            marginLeft: "15px",
                                        }}
                                        onClick={(e) => handleEdit(filproject)}>

                                    </i>

                                </td>
                            </tr>
                        </tbody>
                    )})} 
                </table>  
            </div>         
        </div>
    );
}

export default ManageProject;
