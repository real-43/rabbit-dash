import '@testing-library/jest-dom'
import React from 'react'
import PopupConfirmDelete from "../../Container/Management/ConfirmDelete"
import { mount, shallow, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { render, screen } from '@testing-library/react';
import "core-js/stable";

configure({adapter: new Adapter()});

describe('Confirm delete popup', () => {
    test("render modal window",() => {
        const popupDelete = mount(<PopupConfirmDelete />)
        expect(popupDelete).toMatchSnapshot();
    })
})

describe('Confirm delete popup check component', () => {
    test("render modal header",() => {
        const popupDelete = mount(
            <PopupConfirmDelete
                // onClose={() => setIsDel(false)}
                topic="Project"
                // onConfirm={() => deleteProjects()}
            />
        )
        const passInput = screen.getByRole('dialog',{ name: ""})
        expect(passInput).toHaveBeenCalled(1)
    })
})