import { getDocs, collection, query, where, getDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "./Firebase Config/firebaseSec"
import { useDispatch } from "react-redux";
import { defindAllProjects, defindAllUsers, defindAllRoles } from "./Reducer/firebaseSlice";


/******************************************************* GET ***********************************************************/
/***************** Example of call getUsers, getRoles, getProjects, getRole, getUser, getProject ***********************

import * as GG from '../../MyFireStore';

var a = GG.getUsers().then((value) => {
    console.log("GG", value)
})

************************************************************************************************************************/


const getRoles = async () => {
    const rolesCollectionRef = collection(db, "roles");
    const data = await getDocs(rolesCollectionRef);
    var roles = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    return roles
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

export { getUser, getProject, getRole, getRoles }
/******************************************************* GET ***********************************************************/