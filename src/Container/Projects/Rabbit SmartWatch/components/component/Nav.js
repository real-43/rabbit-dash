import { Nav, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
const Navbar = (props) => {
    const history = useHistory();

    const menuStyle = (name) => ({
        fontSize: '20px',
        color: name === props.pathname ? '#FF9100' : '#000000',
        background: '#FFFFFF',
        border: 0,
        fontWeight: 600,
        marginLeft: '2.5rem'
    })

    // const PrivatemenuStyle = (name,role) => ({
    //     fontSize: '20px',
    //     color: name === props.pathname ? '#FF9100' : '#000000',
    //     background: '#FFFFFF',
    //     border: 0,
    //     fontWeight: 600,
    //     marginLeft: '2.5rem',
    //     display: localStorage.getItem('Status') === 'Admin' ? 'block' : 'none'
    // })

    return (
        <Nav variant="pills">
            {/* <button onClick={() => history.push('/home')} style={menuStyle('/home')} >HOME</button> */}
            {/* <button onClick={() => history.push('/smartwatch_import')} style={PrivatemenuStyle('/smartwatch_import')}>IMPORT</button> */}
            <button onClick={() => history.push('/smartwatch_search')} style={menuStyle('/smartwatch_search')} >SMARTWATCH</button>
            {/* <button onClick={() => history.push('/bts_search')} style={menuStyle('/bts_search')} disabled={localStorage.getItem('Role') === 'FE' || localStorage.getItem('Status') === 'Admin' ? false : true}>BTS</button>
            <button onClick={() => history.push('/user')} style={menuStyle('/user')} disabled={localStorage.getItem('Status') === 'Admin' ? false : true}>USER</button> */}
        </Nav>
    )
}
export default Navbar