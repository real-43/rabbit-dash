import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/dom'
import ReactDOM from 'react-dom';
import { Console } from 'console';
import { Provider } from 'react-redux';
import "core-js/stable";
import firebaseSlice from "../../Reducer/firebaseSlice";
import ManageProject from '../../Container/Management/ManageProject'
import store from '../../store'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
Enzyme.configure({ adapter: new Adapter() });

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
