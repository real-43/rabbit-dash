import { render } from "@testing-library/react"
import '@testing-library/jest-dom'
import React from "react"
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "core-js/stable";


import Header from '../Header'
import store from '../../store'

describe("Test Function Header",()=>{

    test("Header", () => {
        const { getByText } = render(
            <Provider store={store}>
                <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
                    <Routes>
                        <Route path='/' exact element={<Header/>} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        )
        getByText(/ยินดีต้อนรับคุณ :/i)
        getByText(/ออกจากระบบ/i)
    })
} )