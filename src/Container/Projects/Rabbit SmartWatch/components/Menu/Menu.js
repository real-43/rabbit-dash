import React from 'react';
import { StyledMenu } from './Menu.styled';
import { useHistory } from 'react-router-dom';
const Menu = (props) => {
  const history = useHistory();

  const menuStyle = (name) => ({
    color: name === props.pathname ? '#FFFFFF' : '#000000',
    background: name === props.pathname ? '#F5EA11' : '#FFFFFF',
    border: 0
  })
  // const PrivatemenuStyle = (name) => ({
  //   color: name === props.pathname ? '#FFFFFF' : '#000000',
  //   background: name === props.pathname ? '#F5EA11' : '#FFFFFF',
  //   border: 0,
  //   display: localStorage.getItem('Status') === 'Admin' ? 'block' : 'none'
  // })

  return (
    <StyledMenu open={props.open}>
      {/* <button onClick={() => history.push('/smartwatch_import')} style={PrivatemenuStyle('/smartwatch_import')} >IMPORT</button> */}
      <button onClick={() => history.push('/smartwatch_search')} style={menuStyle('/smartwatch_search')}>SMARTWATCH</button>
      {/* <button onClick={() => history.push('/smartwatch_search')} style={menuStyle('/smartwatch_search')} disabled={localStorage.getItem('Role') === 'Team card' || localStorage.getItem('Status') === 'Admin' ? false : true}>SMARTWATCH</button> */}
      {/* <button onClick={() => history.push('/bts_search')} style={menuStyle('/bts_search')} disabled={localStorage.getItem('Role') === 'FE' || localStorage.getItem('Status') === 'Admin' ? false : true}>BTS</button>
      <button onClick={() => history.push('/user')} style={menuStyle('/user')} disabled={localStorage.getItem('Status') === 'Admin' ? false : true}>USER</button> */}
      {/* <button onClick={() => history.push('/home')} style={menuStyle('/home')}>HOME</button>
      <button onClick={() => history.push('/smartwatch_search')} style={menuStyle('/smartwatch_search')}>SMARTWATCH</button>
      <button onClick={() => history.push('/bts_search')} style={menuStyle('/bts_search')}>BTS</button>
      <button onClick={() => history.push('/user')} style={menuStyle('/user')}>USER</button> */}

    </StyledMenu>
  )
}
export default Menu;