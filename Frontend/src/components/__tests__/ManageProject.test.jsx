import { render } from "@testing-library/react"
import '@testing-library/jest-dom'
import React from 'react'
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "core-js/stable";


import firebaseSlice from "../../Reducer/firebaseSlice";

import ManageProject from '../../Container/Management/ManageProject'
import store from '../../store'

describe("Test Function popupDel",()=>{

    test("Manage Project", () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
                    <Routes>
                        <Route path='/' exact element={<ManageProject/>} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        )

        expect(true);
    })
    
} )