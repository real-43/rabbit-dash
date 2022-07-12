import { React } from "react";
import Popup from "../../Container/Management/User/EditPopup.jsx"
import { mount } from 'enzyme';

it('renders content when modal is open', () => {
    // mount renders to the dom (real or mocked)
    const wrapper = mount(<Popup />);
    wrapper.find('button').simulate('click');
  
    // element text
    expect(wrapper.find(Modal).text()).toBe('modal content');
});

it('render Popup component correctly', () => {  
    const Popup = shallow(<Popup />);
    expect(Popup).toMatchSnapshot();
});