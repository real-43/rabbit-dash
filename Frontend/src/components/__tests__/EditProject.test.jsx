import React  from "react";
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Popup from "../../Container/Management/Project/Components/EditProject.jsx"
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { mount, shallow, configure } from 'enzyme';
import { render, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk';
import '@testing-library/jest-dom'

configure({adapter: new Adapter()});

const mockStore = configureMockStore([thunk]);

const store = mockStore({
    Management: {
      Permission: ["Datafile Monitoring","BTS QR"],
      Project: ["Datafile Monitoring","BTS QR"], 
      Services: ["Datafile Monitoring","BTS QR"]
    },
    name:"Admin",
    project: [
        {name:"Datafile Monitoring",subMenu:["1","2"]},
        {name:"BTS QR",subMenu:["1","2"]}
    ]
  },
  {
    Management: {
      Permission: ["Datafile Monitoring"],
      Project: ["Datafile Monitoring"], 
      Services: ["Datafile Monitoring"]
    },
    name:"DatafileMonitoringAdmin",
    project: [{name:"Datafile Monitoring",subMenu:["1","2"]}]
  }
);

const changeProject = {
    name:"BTS QR",
    subMenu: ["Home","BTS"]

}

describe('render Popup component correctly', () => {  
    const Popup = shallow(
    <Provider store={store}>
    <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
        <Routes>
            <Route path='/' exact element={
                <Popup/>
            } />
        </Routes>
    </BrowserRouter>
    </Provider>
).dive();
expect(Popup).toMatchSnapshot();
});

describe('renders content when modal is open', () => {
    // mount renders to the dom (real or mocked)
    
    test("render Save button", () => {
        const pop = mount(
                <Provider store={store} >
                <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
                    <Routes>
                        <Route path='/' exact element={<Popup 
                            onClose={() => setIsOpen(false)}
                            newProjectName={'newProjectName'}
                            submenu={['1','2','3','4']}
                            roles={store}
                            newSubM={['1','2','3','4']}
                            changeProject={changeProject}
                        />} />
                    </Routes>
                </BrowserRouter>
                </Provider>
        );
        const primaryButton = screen.getByRole('button', { name: /Save Change/i })
        expect(primaryButton).toHaveClass('btn-primary')
    })
    test("render Close  button", () => {
        const secondaryButton = screen.getByRole('button', { name: /Close/i })
        expect(secondaryButton).toHaveClass('btn-secondary')
    })
    test("render Header title", () => {
        const passInput = screen.getByRole('title', { name: '' })
        expect(passInput).toHaveClass('modal-title')
    })   
    test("render body content", () => {
        const passInput = screen.getByRole('textbox', { name: 'Project Name' })
        expect(passInput).toHaveClass('form-control')
    })
});

