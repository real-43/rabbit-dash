import { getDocs, collection, query, where, getDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseSec"
import React from "react";


/******************************************************* GET ***********************************************************/
/***************** Example of call getUsers, getRoles, getProjects, getRole, getUser, getProject ***********************

import * as GG from '../../MyFireStore';

var a = GG.getUsers().then((value) => {
    console.log("GG", value)
})

************************************************************************************************************************/

export const GetUsers = async () => { 
    const [users,setUsers] = React.useState([])
    onSnapshot(collection(db,"users"),(function(querySnapshot) {
        var cities = [];
        querySnapshot.forEach(function(doc) {
            cities.push(doc.data());
            // console.log("Current cities in CA: ", cities);
            
        });
        setUsers(cities);
    }));
    return users;
};

export const getRoles = async () => {
    const rolesCollectionRef = collection(db, "roles");
    const data = await getDocs(rolesCollectionRef);
    var roles = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    return roles
}

export const getProjects = async () => {
    const projectsCollectionRef = collection(db, "projects");
    const data = await getDocs(projectsCollectionRef);
    var projects = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    return projects
}

export const getRole = async (roleName) => {
    var role = null
    const q = query(collection(db, "roles"), where("name", "==", roleName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      role = doc.data();
    });
    return role
}

export const getProject = async (projectName) => {
    var project = null
    const q = query(collection(db, "projects"), where("name", "==", projectName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        project = doc.data();
    });
    return project
}

export const getUser = async (uid) => {
    var user = null
    const docRef = doc(db, "users", uid)
    const docSnap = await getDoc(docRef)
    user = docSnap.data()
    const reUser = {...user, id: uid}
    return reUser
}
/******************************************************* GET ***********************************************************/