import React from 'react'
// import { shallowToJson } from 'enzyme-to-json'
// import sinon from 'sinon'
import Adapter from 'enzyme-adapter-react-16';
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
  it('renders a Menu', () => {
    const output = shallow(
        <Provider store={store}>
            <Menu />
        </Provider> 
    )
    expect(output.find('a').length).toEqual(0)
  })
  it('renders aside Menu', () => {
    const output = shallow(
        <Provider store={store}>
            <Menu />
        </Provider> 
    )
    expect(output.find('aside').length).toEqual(0)
  })
  it('renders li Menu', () => {
    const output = shallow(
        <Provider store={store}>
            <Menu />
        </Provider> 
    )
    expect(output.find('li').length).toEqual(0)
  })
  it('renders div Menu', () => {
    const output = shallow(
      <div store={store}>
            <Menu  />
      </div>
    )
    expect(output.find('a').length).toEqual(1)
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