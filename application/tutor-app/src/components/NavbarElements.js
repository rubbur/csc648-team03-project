// Author:  Michael Mathews, Cleveland Plonsey
// Date: 10/1/2023
// Purpose: The header for the whole site that has a nav bar and a search bar and control buttons
//appears on every veiw of the site.

import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";
import { cookie } from "../App";
import SearchBar from "./searchBar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./navbar.scss";
import Notifications from "./notifications/Notifications";
export const Nav = styled.nav`
  background: #666677;
  height: 85px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
`;

export const NavLink = styled(Link)`
  color: #ffffff;
  z-index: 10;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  border: 1px solid transparent;
  box-sizing: border-box;

  &:hover {
    border: 1px solid white;
    border-radius: 5px;
    background-color: rgb(181, 118, 0);
  }

  &.active {
    color: #ffffff;
  }
`;

export const Bars = styled(FaBars)`
  display: none;
  color: #808080;
  z-index: 10;
  @media screen and (max-width: 855px) {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(100%, 100%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;

const MobileLogo = styled.img`
  display: none;
  @media screen and (max-width: 855px) {
    display: block;
    position: absolute;
    width: 100px;
    height: auto;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Logo = styled.img`
  width: 100px;
  height: auto;
  padding-top: 10px;
`;

export const NavMenu = styled.div`
  display: flex;
  min-width: 200px;
  width: 100%;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 855px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  display: none;
  z-index: 1;
  @media screen and (max-width: 855px) {
    z-index: 1;
    display: flex;
    flex-direction: column;
    font-size: 10px;
    position: absolute;
    top: ${({ isOpen }) =>
      isOpen ? "85px" : "-100%"}; /* Adjust top property */
    left: 0;
    background-color: #0c0032;
    width: 100%;
    transition: 0.25s ease-in-out;
  }
`;

const MobileMenuItem = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  padding: 0.5rem;
  text-align: center;
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(cookie.get("userName"));
  useEffect(() => {
    cookie.addChangeListener(() => {
      setUserName(cookie.get("userName"));
    });
    setUserName(cookie.get("userName"));
  }, []);

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const hideMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="site-header">
      <Nav className="navbar">
        <Bars color="#ffffff" onClick={toggleMobileMenu} />
        <Link to="/">
          <MobileLogo
            src="../../images/logo.png"
            alt="Mobile Logo"
            onClick={hideMobileMenu}
          />
        </Link>
        <p className="disclaimer-p">
          <em>
            SFSU Software Engineering Project 648-848, Fall 2023. For
            Demonstration Only.
          </em>
        </p>
        <hr className="disclaimer-p"></hr>
        <NavMenu>
          <div className={"margin-left"}>
            <NavLink to="/">
              <Logo src="/images/logo.png" alt="Logo" />
            </NavLink>
          </div>
          <div className="logo-buffer"></div>
          <SearchBar />
          <NavLink to="/CreatePost">
            <h1>Create Post</h1>
          </NavLink>
          {
            <NavLink to="/AboutUs">
              <h1>About Us</h1>
            </NavLink>
          }
          <div className="logo-buffer"></div>
          {cookie.get("isAdmin") && (
            <NavLink to="/AdminPanel">
              <h1>
                <FontAwesomeIcon icon="gear" />
              </h1>
            </NavLink>
          )}
          {!cookie.get("isLoggedIn") && (
            <NavLink to="/SignIn">
              <h1>Sign In</h1>
            </NavLink>
          )}
          {!cookie.get("isLoggedIn") && (
            <NavLink to="/SignUp">
              <h1>Sign Up</h1>
            </NavLink>
          )}
          {cookie.get("isLoggedIn") && (
            <NavLink to="/Logout">
              <h1>Logout</h1>
            </NavLink>
          )}
          {cookie.get("isLoggedIn") && (
            <div className="margin-right">
              <NavLink to="/Profile">
                <h1>Dashboard</h1>
              </NavLink>
            </div>
          )}
          {cookie.get("isLoggedIn") && (
            <div className="nav-styling">
              <Notifications />
            </div>
          )}
        </NavMenu>
      </Nav>

      <MobileMenu isOpen={isOpen}>
        <SearchBar />
        <p className="mobile-disclaimer">
          <em>
            SFSU Software Engineering Project 648-848, Fall 2023. For
            Demonstration{" "}
          </em>
        </p>
        {cookie.get("isLoggedIn") && !cookie.get("isTutor") && (
          <MobileMenuItem to="/StudentView" onClick={toggleMobileMenu}>
            <h1>Students</h1>
          </MobileMenuItem>
        )}
        {cookie.get("isLoggedIn") && (
          <MobileMenuItem to="/CreatePost" onClick={toggleMobileMenu}>
            <h1>Create Post</h1>
          </MobileMenuItem>
        )}
        <MobileMenuItem to="/AboutUs" onClick={toggleMobileMenu}>
          <h1>About Us</h1>
        </MobileMenuItem>
        {cookie.get("isAdmin") && (
          <MobileMenuItem to="/AdminPanel" onClick={toggleMobileMenu}>
            <h1>
              <FontAwesomeIcon icon="gear" />
            </h1>
          </MobileMenuItem>
        )}
        {!cookie.get("isLoggedIn") && (
          <MobileMenuItem to="/SignIn" onClick={toggleMobileMenu}>
            <h1>Sign In</h1>
          </MobileMenuItem>
        )}
        {!cookie.get("isLoggedIn") && (
          <MobileMenuItem to="/SignUp" onClick={toggleMobileMenu}>
            <h1>Sign Up</h1>
          </MobileMenuItem>
        )}
        {cookie.get("isLoggedIn") && (
          <MobileMenuItem to="/Logout" onClick={toggleMobileMenu}>
            <h1>Logout</h1>
          </MobileMenuItem>
        )}
        {cookie.get("isLoggedIn") && (
          <MobileMenuItem to="/Profile" onClick={toggleMobileMenu}>
            <h1>Dashboard</h1>
          </MobileMenuItem>
        )}
      </MobileMenu>
    </div>
  );
};

export default Navbar;
