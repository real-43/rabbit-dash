import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allUsers: [],
    allProjects: [],
    allRoles: [],
    currentUser: "",
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
        deleteCurrentUser: (state) => {
            state.currentUser = ""
        },
        deleteAll: (state) => {
            state.currentUser = ""
            state.allProjects = []
            state.allRoles = []
            state.allUsers = []
        },
        deleteAllProjects: (state) => {
            state.allProjects = []
        },
        deleteAllRoles: (state) => {
            state.allRoles = []
        },
        deleteAllUsers: (state) => {
            state.allUsers = []
        }
    }
})

export const { defindAllUsers, defindAllProjects, defindAllRoles, defindCurrentUser, deleteCurrentUser } = firebaseSlice.actions;
export default firebaseSlice.reducer;