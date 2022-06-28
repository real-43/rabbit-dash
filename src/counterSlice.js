import { createSlice } from "@reduxjs/toolkit";
import { auth } from "./firebase"

const initialState = {
    allUsers: [],
    allProjects: [],
    allRoles: [],
}

export const counterSlice = createSlice({
    name: "counter",
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
        }
    }
})

export const { defindAllUsers, defindAllProjects, defindAllRoles } = counterSlice.actions;
export default counterSlice.reducer;