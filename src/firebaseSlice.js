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
        }
    }
})

export const { defindAllUsers, defindAllProjects, defindAllRoles, defindCurrentUser } = firebaseSlice.actions;
export default firebaseSlice.reducer;