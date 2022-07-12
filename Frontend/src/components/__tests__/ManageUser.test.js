import { render } from "@testing-library/react"
import '@testing-library/jest-dom'
import React from 'react'
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "core-js/stable";
import store from '../../store'
import ManageUsers from '../../Container/Management/ManageUser'

describe("Management User", () => {

    const { getByTestId } = render(
        <Provider store={store}>
            <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
                <Routes>
                    <Route path='/' exact element={<ManageUsers/>} />
                </Routes>
            </BrowserRouter>
        </Provider>
    )

    test("ManageUser Input Render", () => {
        const nameInput = getByTestId("inputUserName")
        const passInput = getByTestId("inputPassword")
        const emailInput = getByTestId("inputEmail")
        expect(emailInput).toBeTruthy()
        expect(passInput).toBeTruthy()
        expect(nameInput).toBeTruthy()
    })
    
})