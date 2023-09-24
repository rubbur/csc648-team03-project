//Author: Cleveland Plonsey
//admin should be able to get all users
//delete a user
//modify a user
//search up a specific user
//message a user by email possibly---- could be a third priority feature using nodemailer: send an email to the user

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserResult from "./UserResult";
import "./admin.css";

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  //if the user is not an admin then reroute them to the home page
  useEffect(() => {
    const verifyAdmin = async () => {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/admin/verify`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        //TODO: make it if(!res.success) once testing is done.
        //they are not the admin so redirect them back to the landing page
        navigate(`${process.env.REACT_APP_BACKEND_URL}/`);
      }
    };
    verifyAdmin();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/user/searchByName`,
      { name: searchTerm },
      { withCredentials: true }
    );
    if (res.data.success) {
      setUserList([...res.data.searchResults]);
      setSearchTerm("");
    }
  };

  const handleGetAllUsers = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/admin/getAllUsers`,
      {},
      { withCredentials: true }
    );
    if (res.data.success) {
      setUserList([...res.data.allUsers]);
    }
  };

  return (
    <div className="admin-box">
      <h1>Welcome, Admin.</h1>
      <div className="admin-controls">
        <div className="search-box">
          <button id="admin-all-button" onClick={handleGetAllUsers}>
            Get All Users
          </button>

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e)}
          />
          <button id="admin-search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {userList.length > 0 ? (
        <div className="user-list">
          {" "}
          {userList.map((user, index) => {
            return (
              <UserResult
                username={user.username}
                isTutor={user.istutor}
                userId={user.id}
                key={index}
                imgUrl={user.img_url}
              />
            );
          })}{" "}
        </div>
      ) : (
        <h2>No Users To Show</h2>
      )}
    </div>
  );
};

export default Admin;
