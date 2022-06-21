import React from 'react';
import { authSec, db } from '../../firebaseSec';
// import Table from 'react-bootstrap';
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

    const [projects, setProjects] = React.useState([]);
    const projectsCollectionRef = collection(db, "projects");

    React.useEffect(() => {
        const getProjects = async () => {
          const data = await getDocs(projectsCollectionRef);
          setProjects(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getProjects();

    })

    return (
        <div className="content-wrapper">
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
                            <td>{index+1}</td>
                            <td>{project.name}</td>      
                            <td>{project.submenu}.toString()</td>
                        </tr>
                    </tbody>
                )})}
                </table>
            
        </div>
    );
}

export default ManageProject;
