import React from 'react'
import Loading from '../Loading'
import { create } from 'react-test-renderer'

describe('Loading', () => {
    test("test render loading model" ,()=> {
        const test = create(<Loading  isloading={true}/>)
        console.log(test)
        const testInstance = test.root;
        console.log(testInstance)
        
        expect(testInstance.findByType(Loading).props.isLoading).toBeTruthy
    })
})
