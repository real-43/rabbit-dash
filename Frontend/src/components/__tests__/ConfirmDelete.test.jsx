import '@testing-library/jest-dom'
import React from 'react'
import PopupConfirmDelete from "../../Container/Management/ConfirmDelete"
import { mount, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { screen } from '@testing-library/react';
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
        const title = screen.getByRole('title')
        expect(title).toHaveClass('modal-title')
    })

    test("render modal body",() => {
        const body = screen.getByRole('body')
        expect(body).toHaveClass('modal-body')
    })

    test("render Cancle button",() => {
        const secondary_button = screen.getByRole('button', {name: 'Cancle'})
        expect(secondary_button).toHaveClass('btn-secondary')
    })

    test("render Delete button",() => {
        const primary_button = screen.getByRole('button', {name: 'Delete'})
        expect(primary_button).toHaveClass('btn-primary')
    })

})