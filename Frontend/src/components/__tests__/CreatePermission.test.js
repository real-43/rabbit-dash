import { render } from "@testing-library/react"
import '@testing-library/jest-dom'
import React from 'react'

import { optionsProject } from "../../Container/Management/Permission/functionPermission"

describe("Permission", () => {
    test("PermissinoAdmin optionsProject", () => {
        expect(optionsProject([{name: "project one"}, {name: "project two"}, {name: "project three"}])).toStrictEqual([{value: "project one", label: "project one"}, {value: "project two", label: "project two"}, {value: "project three", label: "project three"}])
    })
})