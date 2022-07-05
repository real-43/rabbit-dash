import React, { useState, useEffect }from 'react';
import { db } from '../../Firebase Config/firebaseSec';
import { auth } from '../../Firebase Config/firebase';
import { Table } from 'react-bootstrap';
import { Modal, Form, Button }  from 'react-bootstrap';
import "./signup.css";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ChipInput from 'material-ui-chip-input'
import Loading from '../../components/Loading';
import { useSelector, useDispatch } from "react-redux"
import { defindAllProjects, defindAllRoles } from '../../Reducer/firebaseSlice';
import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    arrayUnion,
    arrayRemove,
    onSnapshot
  } from "firebase/firestore";

const ManageProject = () => {

    const dispatch = useDispatch()

    const user = auth.currentUser
    
    const [newProjectName,setNewProjectName] = useState("")
    const [newSubM,setNewSubM] = useState([])
    const [changeProject,setChangeProject] = useState(null)

    const [isOpen, setIsOpen] = useState(false);
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

    const updateData = async () => {
        onSnapshot(collection(db,"roles"),(function(querySnapshot) {
            let r = [];
            querySnapshot.forEach(function(doc) {
                r.push({...doc.data(), id: doc.id});
            });
            dispatch(defindAllRoles(r))
        }));
    
        onSnapshot(collection(db,"projects"),(function(querySnapshot) {
            let p = [];
            querySnapshot.forEach(function(doc) {
                p.push({...doc.data(), id: doc.id});
            });
            dispatch(defindAllProjects(p))
        }));
    }

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
        setIsLoading(true)

        // let rest = [...projects]
        // rest.push({name: projectInfo.name, subMenu: submenu[submenu.length-1]})

        // setProjects(rest) 

        var a = []
        for (const element of role.Management.Project) {
            a.push(element);
        }
        a.push(projectInfo.name)

        var NewProjectManagement = {
            "Project": a,
            "Permission": a,
            "Services": a
        }
        
        var NewProject = {
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

        // updateData()
        setProjectInfo({ ...projectInfo, name: "" })
        setSubmenu([])
        setIsLoading(false)
    }

    const deleteProjects = async (project) => {
        const userDoc = doc(db, "projects", project.id);
        setIsLoading(true)

        let rest = []
        role.Management.Project.map((p) => {
            if (p !== project.name) {
                rest.push(p)
            }
        })
        setRole({...role, Management: {Permission: rest, Project: rest, Services: rest}})

        var DelProjectManagement = {
            Project: role.Management.Project.filter(obj => obj !== project.name),
            Permission: role.Management.Permission.filter(obj => obj !== project.name),
            Services: role.Management.Services.filter(obj => obj !== project.name)

        }
        var DelProjectDetails = {
            name: project.name,
            subMenu: project.subMenu
        }
        await deleteDoc(userDoc);
        roles.map((role) =>{ 
            const roleDoc = doc(db, "roles", role.id)
            role.project?.map((submenu) =>{
                if(submenu.name === project.name){
                    updateDoc(roleDoc,{
                        project: arrayRemove(DelProjectDetails),
                        Management:DelProjectManagement
                    });
                }      
            })
        }); 
        
        updateData()
        setIsLoading(false)
    }

    const editProject = async (project) =>{

        setIsLoading(true)
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

        updateData()
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
                {popup()}
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
                        {projects.map((pro,index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{pro.name}</td>
                                    <td><Stack direction="row" spacing={1}>
                                        {pro.subMenu.map((sub) => {
                                            return(
                                                <Chip label={sub} clickable/>
                                            )
                                        })}
                                    </Stack></td>
                                    <td>
                                        <i 
                                            class="fa fa-trash" 
                                            aria-hidden="true" 
                                            style={{cursor: "pointer"}}
                                            onClick={(e)=>deleteProjects(pro)}
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
