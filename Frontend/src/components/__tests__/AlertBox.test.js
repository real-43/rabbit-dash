import { render } from "@testing-library/react"
import '@testing-library/jest-dom'
import React from 'react'
import AlertBox from "../alert"

test("Alert Box", () => {
    const { getByTestId } = render(<AlertBox visible={true} severity={"error"} message={"This account has been blocked"} />)
    const txt = getByTestId("alertMessage")
    expect(txt).toHaveTextContent("This account has been blocked")
})