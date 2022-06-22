import React, {useState,useEffect}from 'react';
import { authSec, db } from '../../firebaseSec';
import {Badge} from 'react-bootstrap';   
// import Table from 'react-bootstrap';
import "./signup.css";
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

    const [projectInfo, setProjectInfo] = useState({ name: '', subMenu:{}});

    const [projects, setProjects] = React.useState([]);
    const projectsCollectionRef = collection(db, "projects");

    React.useEffect(() => {
        const getProjects = async () => {
          const data = await getDocs(projectsCollectionRef);
          setProjects(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getProjects();

    })


    const addProjects = async () => {
        await setDoc(doc(db, "users", authSec.currentUser.uid), {
            name: projectInfo.name,
            subMenu: projectInfo.subMenu
          })
    }

    const deleteProjects = async (project) => {
        const userDoc = doc(db, "projects", project.id);
        await deleteDoc(userDoc);
    }

    // const editProjects = async () => {

    // }

    return (
        
        <div className="content-wrapper">
            <div className='input-wrapper'>
                <div className='input-container'>
                    <input className='input-project'
                        placeholder="Name..."
                        onChange={(event) => {
                        setProjectInfo({ ...projectInfo, name: event.target.value })
                        }}
                    />
                    <input className='input-project'
                        type="Email"
                        placeholder="Email..."
                        onChange={(event) => {
                        setProjectInfo({ ...projectInfo, subMenu: event.target.value })
                        }}
                    />
                </div> 
            </div>
            <button className="btn"> Create User</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>Project ID</th>
                        <th>Project Name</th>
                        <th>Submenu</th>
                    </tr>
                </thead>
                {projects.map((project,index) =>{return(
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Maintenance Fee</td>      
                            <td>
                                {project.submenu.map((submenu,index) =>{ return(
                                    <Badge pill bg="primary">
                                        {submenu + " "} 
                                    </Badge>
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
