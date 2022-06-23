import React, {useState,useEffect}from 'react';
import { authSec, db } from '../../firebaseSec';
// import Table from 'react-bootstrap';
import "./signup.css";
import Chip from '@mui/material/Chip';
import ChipInput from 'material-ui-chip-input'

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

    const [subSnap,setSubSnap] = useState(null)

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
    }

    const deleteProjects = async (project) => {
        const userDoc = doc(db, "projects", project.id);
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
       

    }

    const addChip = (value) => {
        // console.log(value)
        const chips = submenu.slice();
        chips.push(value);
        setSubmenu(chips);
    };
    const removeChip = (index) => {
        const chips = submenu.slice();
        chips.splice(index, 1);
        setSubmenu(chips);
    };

    
    return (
        
        <div className="content-wrapper" style={{padding:"20px 20px"}}>
            <form >
                <div class="form-group row">
                    <div class="col-xs-2">
                        <label for="ex1">col-xs-2</label>
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
                        style={{paddingTop: "10px",width:"95%",marginLeft:"20px"}}
                        classes="class1 class2"
                        chips={submenu}
                        onChange={(chips) => addChip(chips)}
                        onDelete={(chips,index) => removeChip(index)}

                    />
                    <button className="btn" type="submit" onClick={(e)=>addProjects(e)}> Create User</button> 
                </div>
            </form>
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
                            </td>
                        </tr>
                    </tbody>
                )})} 
            </table>           
        </div>
    );
}

export default ManageProject;
