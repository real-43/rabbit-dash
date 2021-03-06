import React, { useState, useEffect }from 'react';
import { db } from '../../../Firebase Config/firebaseSec';
import { auth } from '../../../Firebase Config/firebase';
import { Table } from 'react-bootstrap';
import { Modal, Form, Button }  from 'react-bootstrap';
import "../signup.css";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ChipInput from 'material-ui-chip-input'
import Loading from '../../../components/Loading';
import { useSelector, useDispatch } from "react-redux"
import { addTask } from '../../../Reducer/firebaseSlice';
import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    arrayUnion,
    arrayRemove,
  } from "firebase/firestore";
import { useNavigate } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import ConfirmDelete from '../ConfirmDelete';
import EditProject from './Components/EditProject';

const ManageProject = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = auth.currentUser
    
    const [newProjectName,setNewProjectName] = useState("")
    const [newSubM,setNewSubM] = useState([])
    const [changeProject,setChangeProject] = useState(null)

    const [isOpen, setIsOpen] = useState(false);
    const [isDel, setIsDel] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    //handle input 
    const [projectInfo, setProjectInfo] = useState({ name: ''});
    const [submenu, setSubmenu] = useState([])

    const [projectName,setProjectName] =  useState([])
    
    const projectsR = useSelector((state)=> state.firebase.allProjects)
    const rolesR = useSelector((state) => state.firebase.allRoles)

    const [projects, setProjects] = useState([...projectsR]);

    const [roles, setRoles] = useState([...rolesR]);
    const roleR = useSelector((state) => state.firebase.currentRoleFS)
    const [role, setRole] = useState(roleR);

    const AdminDoc = doc(db, "roles", 'XKvFX3M9e07w0qcpxd32');

    const userinfo = useSelector((state) => state.firebase.currentUserFS)

    useEffect(() => {
        const authentication = onAuthStateChanged(auth,(user) => {
            if (!user) {
                navigate('/')
            }
        }) 
        
        return authentication
    },[])

    useEffect(() => {
        setRoles([...rolesR])
    }, [rolesR])

    useEffect(() => {
        setProjects([...projectsR])
    }, [projectsR])

    useEffect(() => {
        setRole(roleR)
    }, [roleR])

    const addProjects = async (e) => {
        e.preventDefault();
        // console.log(projectInfo.name)
        setIsLoading(true)

        dispatch(addTask("Add project"))

        // let rest = [...projects]
        // rest.push({name: projectInfo.name, subMenu: submenu[submenu.length-1]})

        // setProjects(rest) 

        let a = []
        for (const element of role.Management.Project) {
            a.push(element);
        }
        a.push(projectInfo.name)

        let NewProjectManagement = {
            "Project": a,
            "Permission": a,
            "Services": a
        }
        
        let NewProject = {
            name: projectInfo.name,
            subMenu: submenu,
        }

        await addDoc(collection(db, "projects"), NewProject);
        roles.map((role) => { 
            if(role.name === 'Admin'){
                updateDoc(AdminDoc,{
                    project: arrayUnion(NewProject),
                    Management: NewProjectManagement
                });
            }   
        });

        setProjectInfo({ ...projectInfo, name: "" })
        setSubmenu([])
        setIsLoading(false)
    }

    const deleteProjects = async () => {
        const userDoc = doc(db, "projects", changeProject.id);
        setIsLoading(true)

        setIsDel(false)

        dispatch(addTask("Delete project"))

        let rest = []
        role.Management.Project.map((p) => {
            if (p !== changeProject.name) {
                rest.push(p)
            }
        })
        setRole({...role, Management: {Permission: rest, Project: rest, Services: rest}})

        let DelProjectManagement = {
            Project: role.Management.Project.filter(obj => obj !== changeProject.name),
            Permission: role.Management.Permission.filter(obj => obj !== changeProject.name),
            Services: role.Management.Services.filter(obj => obj !== changeProject.name)

        }
        let DelProjectDetails = {
            name: changeProject.name,
            subMenu: changeProject.subMenu
        }
        await deleteDoc(userDoc);
        roles.map((role) =>{ 
            const roleDoc = doc(db, "roles", role.id)
            role.project?.map((submenu) =>{
                if(submenu.name === changeProject.name){
                    updateDoc(roleDoc,{
                        project: arrayRemove(DelProjectDetails),
                        Management:DelProjectManagement
                    });
                }      
            })
        }); 
        
        handleCloseDel()
        setIsLoading(false)
    }

    const editProject = async (project) =>{

        setIsLoading(true)

        dispatch(addTask("Edit project"))

        setIsOpen(!isOpen)
        const projectDoc = doc(db, "projects", project.id);
    
        await updateDoc(projectDoc, {
            "name": newProjectName,
            "subMenu": submenu
        });

        roles.map((role) =>{ 
            const roleDoc = doc(db, "roles", role.id)
            role.project?.map((proJ) =>{
                if(proJ.name === project.name){
                    updateDoc(roleDoc,{
                        project: arrayRemove({
                            name: project.name,
                            subMenu: project.subMenu
                        }),
                    });  
                    updateDoc(roleDoc,{
                        project: arrayUnion({
                            name: newProjectName,
                            subMenu: submenu
                        })
                    });   
                }    
            })
                       
        });

        setIsLoading(false)
    }

    const handleChip = (value) => {
        const chips = submenu.slice();
        chips.push(value);
        setSubmenu(chips[chips.length - 1]);
    };

    const handleEdit = (project) => {
        setIsOpen(!isOpen)
        setNewProjectName(project.name)
        setNewSubM(project.subMenu)
        setChangeProject(project)
    }

    const handleDelete = (project) => {
        setIsDel(true)
        setChangeProject(project)
    }

    const handleCloseDel = () => {
        setIsDel(false)
        setChangeProject([])
    }

    const getProjectPermission = () =>{
        roles.map(permission =>{ 
            if (permission.name === userinfo.role){ 
                setProjectName(permission.Management.Project)
                
            }
        })
        
    } 
    if (projectName.length===0 && user !== null){
        getProjectPermission()
    }
    
    // Popup of edit
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
                        onChange={(e) => setNewProjectName(e.target.value.replace(/[^\\]_-/, ""))}
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
            <div className='manage-project' data-testid="Input">
                {(role.name === "Admin") ? (
                    <div>
                        <form data-testid="Input" >
                            <div class="form-group row">
                                <div class="col-xs-2">
                                    <label for="ex1" style={{paddingBottom: '20px'}}>Project Management</label>
                                    <input 
                                        class="form-control" 
                                        id="ex1" 
                                        type="text" 
                                        onChange={(event) => {
                                            setProjectInfo({ ...projectInfo, name: event.target.value.replace(/[^a-zA-Z ]/g, "") })
                                        }}
                                        value={projectInfo.name}
                                        placeholder=" Project Name..."
                                        
                                    />
                                </div>
                                <ChipInput 
                                    style={{paddingTop: "10px",width:"97.5%",marginLeft:"20px"}}
                                    value={submenu}
                                    onChange={(chips) => handleChip(chips)}
                                    placeholder=" Submenu..."
                                />
                                <button className="btn" type="submit" onClick={(e)=>addProjects(e)} style={{marginTop: "15px"}}> Create Project</button> 
                            </div>
                        </form>
                    </div>
                ) : ""}
                
                {(isOpen) ? (
                    <EditProject 
                        onClose={() => setIsOpen(false)}
                        newProjectName={newProjectName}
                        submenu={submenu}
                        roles={roles}
                        newSubM={newSubM}
                        changeProject={changeProject}
                    />
                ) : ""}
                {(isDel) ? (
                    <ConfirmDelete
                        onClose={() => setIsDel(false)}
                        topic="Project"
                        onConfirm={() => deleteProjects()}
                    />
                ) : ""}
                <Table striped bbordered>
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Project Name</th>
                            <th>Sub Menu</th>
                            <th>Commands</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.filter(project => projectName.includes(project.name)).map((pro,index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{pro.name}</td>
                                    <td><Stack direction="row" spacing={1}>
                                        {pro.subMenu.map((sub) => {
                                            return(
                                                <Chip label={sub} clickable key={sub}/>
                                            )
                                        })}
                                    </Stack></td>
                                    <td>
                                        <i 
                                            class="fa fa-trash" 
                                            aria-hidden="true" 
                                            style={{cursor: "pointer"}}
                                            onClick={(e)=>handleDelete(pro)}
                                        >
                                        </i>
                                        <i 
                                            class="fa fa-cogs" 
                                            aria-hidden="true" 
                                            style={{
                                                cursor: "pointer",
                                                marginLeft: "15px",
                                            }}
                                            onClick={(e) => handleEdit(pro)}>

                                        </i>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>         
        </div>
    );
}

export default ManageProject;
