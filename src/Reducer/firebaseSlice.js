import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allUsers: [],
    allProjects: [],
    allRoles: [],
    currentUser: "", // User in auth
    currentUserFS: [], // User in firestore not auth
    currentRoleFS: [], // Role in firestore
    task: [],
    BTSQRDataStore: []
}

export const firebaseSlice = createSlice({
    name: "firebase",
    initialState,
    reducers: {
        defindAllUsers: (state, action) => {
            state.allUsers = action.payload
        },
        defindAllProjects: (state, action) => {
            state.allProjects = action.payload
        },
        defindAllRoles: (state, action) => {
            state.allRoles = action.payload
        },
        defindCurrentUser: (state, action) => {
            state.currentUser = action.payload
        },
        defindCurrentUserFS: (state, action) => {
            state.currentUserFS = action.payload
        },
        defindCurrentRoleFS: (state, action) => {
            state.currentRoleFS = action.payload
        },
        addTask: (state, action) => {
            state.task.push(action.payload)
        },
        storeFetchDataBTAQR: (state, action) => {
            state.BTSQRDataStore = action.payload
        },



        deleteCurrentUser: (state) => {
            state.currentUser = ""
        },
        deleteAll: (state) => {
            state.currentUser = ""
            state.allProjects = []
            state.allRoles = []
            state.allUsers = []
            state.currentRoleFS = []
            state.currentUserFS = []
            state.task = []
            state.dataPDF = []
        },
        deleteAllProjects: (state) => {
            state.allProjects = []
        },
        deleteAllRoles: (state) => {
            state.allRoles = []
        },
        deleteAllUsers: (state) => {
            state.allUsers = []
        },
        deleteCurrentUserFS: (state) => {
            state.currentUserFS = []
        },
        deleteCurrentRoleFS: (state) => {
            state.currentRoleFS = []
        },
        deleteTask: (state) => {
            state.task = []
        },
        popTask: (state, action) => {
            let newTask = []
            state.task.map((t) => {
                if (!t.includes(action.payload)) {
                    newTask.push(t)
                }
            })
            state.task = newTask
        },
        deleteDataPDF: (state) => {
            state.dataPDF = []
        }
    }
})

export const {
    defindAllUsers,
    defindAllProjects,
    defindAllRoles,
    defindCurrentUser,
    defindCurrentRoleFS,
    defindCurrentUserFS,
    deleteCurrentUser,
    deleteAll,
    deleteAllProjects,
    deleteAllRoles,
    deleteAllUsers,
    deleteCurrentRoleFS,
    deleteCurrentUserFS,
    popTask,
    deleteTask,
    addTask,
    storeFetchDataBTAQR
} = firebaseSlice.actions;
export default firebaseSlice.reducer;