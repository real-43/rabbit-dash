import { getDocs, collection, query, where, getDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "./Reducer/Firebase Config/firebaseSec"
import React from "react";
import { useDispatch } from "react-redux";
import { defindAllProjects, defindAllUsers, defindAllRoles } from "./Reducer/firebaseSlice";


/******************************************************* GET ***********************************************************/
/***************** Example of call getUsers, getRoles, getProjects, getRole, getUser, getProject ***********************

import * as GG from '../../MyFireStore';

var a = GG.getUsers().then((value) => {
    console.log("GG", value)
})

************************************************************************************************************************/



function GetAll(command) {
    const dispatch = useDispatch()

    if (command === "all" || command === "users") {
        onSnapshot(collection(db,"users"),(function(querySnapshot) {
            let users = [];
            querySnapshot.forEach(function(doc) {
                users.push({...doc.data(), id: doc.id});
            });
            dispatch(defindAllUsers(users))
        }));
    }
    
    if (command === "all" || command === "roles") {
        onSnapshot(collection(db,"roles"),(function(querySnapshot) {
            let roles = [];
            querySnapshot.forEach(function(doc) {
                roles.push({...doc.data(), id: doc.id});
            });
            dispatch(defindAllRoles(roles))
        }));
    }

    if (command === "all" || command === "projects") {
        onSnapshot(collection(db,"projects"),(function(querySnapshot) {
            let projects = [];
            querySnapshot.forEach(function(doc) {
                projects.push({...doc.data(), id: doc.id});
            });
            dispatch(defindAllProjects(projects))
        }));
    }
};

const GetUsers = async () => {
const dispatch = useDispatch()

    onSnapshot(collection(db,"users"),(function(querySnapshot) {
        let users = [];
        querySnapshot.forEach(function(doc) {
            users.push({...doc.data(), id: doc.id});
        });
        dispatch(defindAllUsers(users))
    }));
};

const GetRoles = async () => {
const dispatch = useDispatch()

    onSnapshot(collection(db,"roles"),(function(querySnapshot) {
        let roles = [];
        querySnapshot.forEach(function(doc) {
            roles.push({...doc.data(), id: doc.id});
        });
        dispatch(defindAllRoles(roles))
    }));
}

const getRoles = async () => {
    const rolesCollectionRef = collection(db, "roles");
    const data = await getDocs(rolesCollectionRef);
    var roles = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    return roles
}

const GetProjects = async () => {
const dispatch = useDispatch()

    onSnapshot(collection(db,"projects"),(function(querySnapshot) {
        let projects = [];
        querySnapshot.forEach(function(doc) {
            projects.push({...doc.data(), id: doc.id});
        });
        dispatch(defindAllProjects(projects))
    }));
}

const getRole = async (roleName) => {
    var role = null
    const q = query(collection(db, "roles"), where("name", "==", roleName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      role = {...doc.data(), id: doc.id};
    });
    return role
}

const getProject = async (projectName) => {
    var project = null
    const q = query(collection(db, "projects"), where("name", "==", projectName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        project = {...doc.data(), id: doc.id};
    });
    return project
}

const getUser = async (uid) => {
    var user = null
    const docRef = doc(db, "users", uid)
    const docSnap = await getDoc(docRef)
    user = docSnap.data()
    const reUser = {...user, id: uid}
    return reUser
}

export { GetAll, getUser, getProject, getRole, getRoles }
/******************************************************* GET ***********************************************************/