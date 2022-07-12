import { getByTestId, queryByPlaceholderText, render, screen } from "@testing-library/react"
import '@testing-library/jest-dom'
import React from 'react'
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "core-js/stable";


import ManageProject from '../../Container/Management/ManageProject'
import store from '../../store'

test("Manage Project", () => {
    const { getByTestId, getByText } = render(
        <Provider store={store}>
            <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
                <Routes>
                    <Route path='/' exact element={<ManageProject/>} />
                </Routes>
            </BrowserRouter>
        </Provider>
    )
    
    const input = getByTestId("Input")
    getByText(/Number/i)
    getByText(/Project Name/i)
    getByText(/Sub Menu/i)
    getByText(/Commands/i)
    expect(input).toBeTruthy()
})