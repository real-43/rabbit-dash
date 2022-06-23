import React, { useState } from 'react'
import { Table } from 'react-bootstrap';
import { getRoles } from '../../MyFireStore';


//This Page will show all roles in firebase and can edit or delete roles
export default function Permission() {

    const [allRoles, setAllRoles] = useState([]);

    if (allRoles.length < 1) {
        getRoles().then((value) => {
            setAllRoles(value)
        })
    }

    return (
        <div className='content-wrapper'>
            <div className='permission'>
                <Table striped bbordered hover>
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Role Name</th>
                            <th>Projects</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allRoles.map((roles,index) => {
                            return (
                                <tr>
                                    <td>{index}</td>
                                    <td>{roles.name}</td>
                                    {roles.project.map((project) => {
                                        <td>{project.name}</td>
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>

            </div>
        </div>
    )
}
