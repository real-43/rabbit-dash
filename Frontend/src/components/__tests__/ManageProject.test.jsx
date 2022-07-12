<<<<<<< HEAD
import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/dom'
import ReactDOM from 'react-dom';
import { Console } from 'console';
=======
import { getByTestId, queryByPlaceholderText, render, screen } from "@testing-library/react"
import '@testing-library/jest-dom'
import React from 'react'
>>>>>>> 906c8216f1b3ca92804f78c5bf66e92e176adb99
import { Provider } from 'react-redux';
import "core-js/stable";
<<<<<<< HEAD
import firebaseSlice from "../../Reducer/firebaseSlice";
=======


>>>>>>> 906c8216f1b3ca92804f78c5bf66e92e176adb99
import ManageProject from '../../Container/Management/ManageProject'
import store from '../../store'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
Enzyme.configure({ adapter: new Adapter() });

<<<<<<< HEAD
describe("Test Function popupDel",()=>{

    test("Manage Project", () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
                   <ManageProject/>
                </BrowserRouter>
            </Provider>
        )
    })
    
} )

describe('Test Case for Create Project Page', () => {
    const menu = (
        <Provider store={store}>
            <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
                <ManageProject />
            </BrowserRouter>
        </Provider>
    );
    test('Validate Create Project Label render', () => {
        console.log(menu)
        const wrapper = mount(menu)
        console.log(wrapper)
        const createProject = wrapper.find('ManageProject');  
        
        expect(createProject).toHaveLength(1);
      
    });
});
=======
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
>>>>>>> 906c8216f1b3ca92804f78c5bf66e92e176adb99
