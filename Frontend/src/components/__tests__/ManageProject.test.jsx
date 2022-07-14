import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import "core-js/stable";
import ManageProject from '../../Container/Management/Project/ManageProject'
import store from '../../store'
import { BrowserRouter } from 'react-router-dom';
Enzyme.configure({ adapter: new Adapter() });

describe("Manage Project", ()=>{

    test("Manage Project Table Header", () => {
        const { getByTestId, getByText } = render(
            <Provider store={store}>
                <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
                   <ManageProject/>
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

    
    
} )

describe('Test Case for Create Project Page', () => {
    jest.mock('../../Container/Management/Project/ManageProject', () => 'ManageProject');
    // const menu = (
    //     <Provider store={store}>
    //         <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
    //             <ManageProject />
    //         </BrowserRouter>
    //     </Provider>
    // );
    // test('Validate Create Project Label render', () => {
    //     // console.log(menu)
    //     const wrapper = mount(menu)
    //     // console.log(wrapper)
    //     const createProject = wrapper.find('ManageProject');  
        
    //     expect(createProject).toHaveLength(1);
      
    // });
});
