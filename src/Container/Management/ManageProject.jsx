import React from 'react';
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
            <div className='input-wrapper'>
                <div className='input-container'>
                    <input className='input-register'
                        placeholder="Name..."
                        onChange={(event) => {
                        // setUserInfo({ ...userInfo, name: event.target.value })
                        }}
                    />
                    <input className='input-register'
                        type="Email"
                        placeholder="Email..."
                        onChange={(event) => {
                        // setUserInfo({ ...userInfo, email: event.target.value })
                        }}
                    />
                    <input className='input-register'
                        type="Password"
                        placeholder="Password..."
                        onChange={(event) => {
                        // setUserInfo({ ...userInfo, password: event.target.value })
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
                {/* {projects.map((project,index) =>{return( */}
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Maintenance Fee</td>      
                            <td>
                                {/* {project.subMenu.map((submenu,index) =>{ return( */}
                                    <Badge pill bg="primary">
                                        {/* {submenu} */}hiasdasdassd
                                    </Badge>
                                {/* ) })}   */}
                            </td>
                        </tr>
                    </tbody>
                {/* )})} */}
            </table>           
        </div>
    );
}

export default ManageProject;
