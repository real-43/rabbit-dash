import React from 'react'
import { auth } from '../firebase'

const authentication = onAuthStateChanged(auth,(user) => {
    if (user) {
        router('/dashboard')
    } else {
        router('/')
    }
    return authentication
})

export { authentication }