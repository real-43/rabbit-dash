import styled from 'styled-components';

export const StyledMenu = styled.nav`
  display: ${({ open }) => open ? 'flex': 'none'};
  flex-direction: column;
  background: #30211E;
  height: 100vh;
  width: 260px;
  text-align: left;
  padding: 4rem 0 0 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  
  @media (max-width: 768) {
    width: 100%;
  }

  button {
    margin: 0 0 0 0 !important;
    font-size: 2rem !important;
    text-transform: uppercase;
    font-weight: bold;
    color: #E8D0D6;
    z-index: 2 !important;
      
    :first-child {
      border-bottom: 2px solid #86C2B2 !important;
    }

    :nth-child(2) {
      border-bottom: 2px solid #86C2B2!important;
    }

    :nth-child(3) {
      border-bottom: 2px solid #86C2B2!important;
    }

    &:hover {
      color: #0101FF;
    }
  }
`;