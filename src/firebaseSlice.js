import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allUsers: [],
    allProjects: [],
    allRoles: [],
    currentUser: "",
    currentUserFS: [],
    currentRoleFS: [],
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
        }
    }
})

export const { defindAllUsers, 
    defindAllProjects, defindAllRoles, defindCurrentUser, defindCurrentRoleFS, defindCurrentUserFS,
    deleteCurrentUser, deleteAll, deleteAllProjects, deleteAllRoles, deleteAllUsers, deleteCurrentRoleFS, 
    deleteCurrentUserFS } = firebaseSlice.actions;
export default firebaseSlice.reducer;