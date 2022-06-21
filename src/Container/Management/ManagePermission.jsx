import React, { useState } from 'react'
import { getUsers } from '../../MyFireStore'

export default function ManagePermission() {
    const [users, setUsers] = useState(null)
    
    // getUsers().then((value) => {setUsers(value)});
    // console.log("IM USER: ", users)
    return (
        <div className='content-wrapper'>ManagePermission</div>
    )
}
