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

    return (
        <Nav variant="pills">
            <button onClick={() => history.push('/home')} style={menuStyle('/home')} >HOME</button>
            <button onClick={() => history.push('/bts_search')} style={menuStyle('/bts_search')} >BTS</button>
            <button onClick={() => history.push('/User')} style={menuStyle('/User')} >BTS USER</button>
        </Nav>
    )
}
export default Navbar