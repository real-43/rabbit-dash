import { createSlice } from "@reduxjs/toolkit";
import { auth } from "./firebase"

const initialState = {
    value: 0,
    name: auth.currentUser,
    users: [],
}

export const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1
        },
        decrement: (state) => {
            state.value -= 1
        },
        addvalue: (state, action) => {
            state.name = action.payload
        },
        setUsers: (state, action) => {
            state.users = action.payload
        },
        setName: (state, action) => {
            state.name = action.payload
        }
    }
})

export const { increment, decrement, addvalue, setUsers, setName } = counterSlice.actions;
export default counterSlice.reducer;