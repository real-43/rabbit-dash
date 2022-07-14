import React  from "react";
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Popup from "../../Container/Management/User/Components/EditPopup"
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

const currentRole = {
    Management: {
        Permission: ["Datafile Monitoring"],
        Project: ["Datafile Monitoring"], 
        Services: ["Datafile Monitoring"]
    },
    name:"DatafileMonitoringAdmin",
    project: [{name:"Datafile Monitoring",subMenu:["1","2"]}]    
}

const changeUser = {
    id: "Lw8rguKkI9WorgC8M7m9f5TuObg2", 
    email:"test@rabbit.co.th",
    isBlocked: false,
    name: "test",
    password: "123123",
    role: "DatafileMonitoringStaff"
}

const currentUser = {
    id: "Lw8rguKkI9WorgC8M7m9f5TuObg2", 
    email:"test@rabbit.co.th",
    isBlocked: false,
    name: "test",
    password: "123123",
    role: "DatafileMonitoringStaff"
}

describe('renders content when modal is open', () => {
    // mount renders to the dom (real or mocked)
    
    test("render Save button", () => {
        const {asFragment, getByText} = render(
                <Provider store={store} >
                <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
                    <Routes>
                        <Route path='/' exact element={<Popup 
                            roles={Object.values(store)}
                            changeUser={changeUser} 
                            newName={'newName'}
                            newPassword={'newPassword'}
                            currentUser={currentUser}
                            currentRole={currentRole}
                            role={"DatafileMonitoringStaff"}
                            onClose={() => {setIsOpen(false)}}
                        />} />
                    </Routes>
                </BrowserRouter>
                </Provider>
        );
        const primaryButton = screen.getByRole('button', { name: /Save Change/i })
        expect(primaryButton).toHaveClass('btn-primary')
    })
    test("render Close  button", () => {
        const {asFragment, getByText} = render(
                <Provider store={store} >
                <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
                    <Routes>
                        <Route path='/' exact element={<Popup 
                            roles={Object.values(store)}
                            changeUser={changeUser} 
                            newName={'newName'}
                            newPassword={'newPassword'}
                            currentUser={currentUser}
                            currentRole={currentRole}
                            role={"DatafileMonitoringStaff"}
                            onClose={() => {setIsOpen(false)}}
                        />} />
                    </Routes>
                </BrowserRouter>
                </Provider>
        );
        const secondaryButton = screen.getByRole('button', { name: /Close/i })
        expect(secondaryButton).toHaveClass('btn-secondary')
    })
    test("render name input", () => {
        const {asFragment, getByText} = render(
                <Provider store={store} >
                <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
                    <Routes>
                        <Route path='/' exact element={<Popup 
                            roles={Object.values(store)}
                            changeUser={changeUser} 
                            newName={'newName'}
                            newPassword={'newPassword'}
                            currentUser={currentUser}
                            currentRole={currentRole}
                            role={"DatafileMonitoringStaff"}
                            onClose={() => {setIsOpen(false)}}
                        />} />
                    </Routes>
                </BrowserRouter>
                </Provider>
        );
        const passInput = screen.getByRole('textbox', { value: /Name/i })
        expect(passInput).toHaveClass('form-control')
    })   
});
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
