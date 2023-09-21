import React from 'react';
import { FaBars } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';
import {cookie} from "../App"

/* changes the nav bar color */
export const Nav = styled.nav`
  background: #666677;
  height: 85px;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem calc((100vw - 1000px) / 2);
  z-index: 12;
`;

export const NavLink = styled(Link)`
  color: #FFFFFF;
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
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: -24px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Navbar = () => {
  return (
    <div>
      <Nav>
        <NavMenu>
          <NavLink to="/"><h1>Home</h1></NavLink>
          
          {(cookie.get("isLoggedIn") && !cookie.get("isTutor")) && <NavLink to="/StudentView"><h1>Students</h1></NavLink>}
          <NavLink to="/AboutUs"><h1>About Us</h1></NavLink>
          {cookie.get("isAdmin") && <NavLink to="/AdminPanel"><h1>Admin Control</h1></NavLink>}
          {!cookie.get("isLoggedIn") && <NavLink to="/SignIn"><h1>Sign In</h1></NavLink>}
          {!cookie.get("isLoggedIn") && <NavLink to="/SignUp"><h1>Sign Up</h1></NavLink>}
          {cookie.get("isLoggedIn") && <NavLink to="/Logout"><h1>Log Out</h1></NavLink>}
        </NavMenu>
      </Nav>
    </div>
  );
};

export default Navbar;
