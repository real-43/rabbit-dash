import React from 'react'
// import { shallowToJson } from 'enzyme-to-json'
// import sinon from 'sinon'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Provider } from 'react-redux';
import { shallow, configure, mount } from 'enzyme';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk';
import Menu from '../Menu'
// import store from '../../store'
import "core-js/stable";


const mockStore = configureMockStore([thunk]);
configure({adapter: new Adapter()});
describe('Menu', () => {
  /*
  *   Test by counting number of elements
  */
  const store = mockStore({
    Management: {
      Permission: ["1"],
      Project: ["1"], 
      Services: ["1"]
    },
    name:"HI",
    project: [{name:"project1",subMenu:["1","2"]}]
  });

  it("renders without crashing", () => {
    shallow(<Provider store={store}><Menu /></Provider>);
  });

  it('renders a Menu', () => {
    const output = shallow(
        <Provider store={store}>
            <Menu />
        </Provider> 
    )
    expect(output.find('a').length).toEqual(0)
  })

//   it('renders an output area', () => {
//     const output = shallow(<Link />)
//     expect(output.find('div.output-area').length).toEqual(1)
//   })

//   it('renders a heading inside the output area', () => {
//     const output = shallow(<Link />)
//     expect(output.find('div.output-area').find('h2').length).toEqual(1)
//   })

//   it('renders the link inside the output area', () => {
//     const output = shallow(<Link />)
//     expect(output.find('div.output-area').find('a').length).toEqual(1)
//   })

})