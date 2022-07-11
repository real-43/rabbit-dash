import React  from 'react';
import ManageProject from '../../Container/Management/ManageProject';
import renderer from 'react-test-renderer';


test("Test Function popupDel",()=>{
    let component = renderer.create(<ManageProject />).getInstance();

    let tree =  component.popupDel();
    expected(tree).toBe(tree)
} )