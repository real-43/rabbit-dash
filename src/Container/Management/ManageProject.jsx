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
  } from "firebase/firestore";
  
  
const ManageProject = () => {


    const [projectInfo, setProjectInfo] = useState({ name: ''});
    const [submenu, setSubmenu] = useState([])

    const [projects, setProjects] = React.useState([]);
    const projectsCollectionRef = collection(db, "projects");

    const getProjects = async () => {
        const data = await getDocs(projectsCollectionRef);
        setProjects(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        console.log(data);
    };
    if (projects.length==0){ 
       
        getProjects()
       
    }
        
    


    const addProjects = async (e) => {
        e.preventDefault();
        await addDoc(collection(db, "projects"), {
            name: projectInfo.name,
            submenu: submenu[submenu.length-1],
        });
        setProjects({ name: ''})
        // console.log(submenu)
    }

    const deleteProjects = async (project) => {
        const userDoc = doc(db, "projects", project.id);
        await deleteDoc(userDoc);
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
                    </tr>
                </thead>
                {projects.map((project,index) =>{return(
                    <tbody>
                        <tr className="border align-items-center ">
                            <td>{index+1}</td>
                            <td>{project.name}</td>      
                            <td>
                                {project.submenu?.map((submenu,index) =>{ return(
                                    <>
                                     <Chip label={submenu} clickable />
                                    <div></div>
                                    </>
                                ) })}   
                            </td>
                        </tr>
                    </tbody>
                )})} 
            </table>           
        </div>
    );
}

export default ManageProject;
