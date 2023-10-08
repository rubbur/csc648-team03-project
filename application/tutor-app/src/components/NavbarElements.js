import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';
import { cookie } from '../App';
import SearchBar from './searchBar/SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./navbar.css";

export const Nav = styled.nav`
  background: #666677;
  height: 85px;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem calc((100vw - 1000px) / 2);
  z-index: 10;
`;

export const NavLink = styled(Link)`
  color: #ffffff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  &.active {
    color: #ffffff;
  }
`;

export const Bars = styled(FaBars)`
  display: none;
  color: #808080;
  z-index: 10;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(100%, 100%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;


export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  display: none;
  z-index: 9;
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    font-size: 10px;
    position: absolute;
    top: ${({ isOpen }) => (isOpen ? '85px' : '-100%')}; /* Adjust top property */
    left: 0;
    background: #666677;
    width: 100%;
    transition: 0.25s ease-in-out;
  }
`;


const MobileMenuItem = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  padding: 1rem;
  text-align: center;
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='site-header'>
      <Nav className='navbar'>
        <Bars color='#ffffff' onClick={toggleMobileMenu} />
        <NavMenu>
          <NavLink to="/"><h1> <FontAwesomeIcon icon="house" /></h1></NavLink>
          <SearchBar/>
          {(cookie.get("isLoggedIn") && !cookie.get("isTutor")) && <NavLink to="/StudentView"><h1>Students</h1></NavLink>}
          {<NavLink to="/AboutUs"><h1>About Us</h1></NavLink>}
          {<NavLink to="/AdminPanel"><h1><FontAwesomeIcon icon="gear"/></h1></NavLink>}
          {!cookie.get("isLoggedIn") && <NavLink to="/SignIn"><h1>Sign In</h1></NavLink>}
          {!cookie.get("isLoggedIn") && <NavLink to="/SignUp"><h1>Sign Up</h1></NavLink>}
          {cookie.get("isLoggedIn") && <NavLink to="/Logout"><h1><FontAwesomeIcon icon="right-from-bracket"/></h1></NavLink>}
          {cookie.get("isLoggedIn") && <NavLink to="/Profile"><h1>{cookie.get("userName")}</h1></NavLink>}
        </NavMenu>
      </Nav>
      <MobileMenu isOpen={isOpen}>
        <MobileMenuItem to="/" onClick={toggleMobileMenu}>
          <h1>Home</h1>
        </MobileMenuItem>
        {cookie.get('isLoggedIn') && !cookie.get('isTutor') && (
          <MobileMenuItem to="/StudentView" onClick={toggleMobileMenu}>
            <h1>Students</h1>
          </MobileMenuItem>
        )}
        <MobileMenuItem to="/AboutUs" onClick={toggleMobileMenu}>
        <h1>About Us</h1>
        </MobileMenuItem>
        {/*cookie.get('isAdmin') && (
          <MobileMenuItem to="/AdminPanel" onClick={toggleMobileMenu}>
            <h1>Admin Control</h1>
          </MobileMenuItem>
        )*/}
        {!cookie.get('isLoggedIn') && (
          <MobileMenuItem to="/SignIn" onClick={toggleMobileMenu}>
            <h1>Sign In</h1>
          </MobileMenuItem>
        )}
        {!cookie.get('isLoggedIn') && (
          <MobileMenuItem to="/SignUp" onClick={toggleMobileMenu}>
            <h1>Sign Up</h1>
          </MobileMenuItem>
        )}
        {cookie.get('isLoggedIn') && (
          <MobileMenuItem to="/Logout" onClick={toggleMobileMenu}>
            <h1>Log Out</h1>
          </MobileMenuItem>
        )}
        {cookie.get('isLoggedIn') && (
          <MobileMenuItem to="/Profile" onClick={toggleMobileMenu}>
            <h1>{cookie.get("userName")}</h1>
          </MobileMenuItem>
        )}
      </MobileMenu>
    </div>
  );
};

export default Navbar;
