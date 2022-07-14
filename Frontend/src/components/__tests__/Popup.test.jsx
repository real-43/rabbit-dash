import React  from "react";
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Popup from "../../Container/Management/User/EditPopup.jsx"
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { mount, shallow, configure } from 'enzyme';
import { render } from '@testing-library/react';
// import store from '../../store'
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

it('renders content when modal is open', () => {
    // mount renders to the dom (real or mocked)
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
                
    expect(getByText('Edit User')).toBeInTheDocument()
    // expect(asFragment()).toMatchInlineSnapshot(`<h1>Hello, World!</h1>`)
});

it('render Popup component correctly', () => {  
    const Popup = shallow(
        <Provider store={store}>
        <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
            <Routes>
                <Route path='/' exact element={<Popup/>} />
            </Routes>
        </BrowserRouter>
        </Provider>
    ).dive();
    expect(Popup).toMatchSnapshot();
});