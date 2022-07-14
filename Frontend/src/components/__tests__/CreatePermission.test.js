import '@testing-library/jest-dom'
import React from 'react'

import { optionsProject, getProjectName, subMenuOptions } from "../../Container/Management/Permission/Components/functionPermission"

describe("Permission", () => {

    var allProject = [
        { name: "project one", subMenu: ["Home", "BTS"] },
        { name: "project two", subMenu: ["Search"] },
        { name: "project three", subMenu: ["PDF", "Notification", "Setting"] }
    ]

    test("Permission optionsProject", () => {
        var check = [
            { value: "project one", label: "project one" },
            { value: "project two", label: "project two" },
            { value: "project three", label: "project three" }
        ]
        expect(optionsProject(allProject)).toStrictEqual(check)
    })

    test("PermssionAdmin getProjectName", () => {
        var check = ["project one", "project two", "project three"]
        expect(getProjectName(allProject)).toStrictEqual(check)
    })

    test("PermissionAdmin subMenuOptions", () => {
        var event = [
            { value: "project one", label: "project one" },
            { value: "project two", label: "project two" }
        ]

        var check = [
            { name: "project one", options: [{ value: "Home", label: "Home" }, { value: "BTS", label: "BTS" }] },
            { name: "project two", options: [{ value: "Search", label: "Search" }] }
        ]

        expect(subMenuOptions(event, allProject)).toStrictEqual(check)
    })
})