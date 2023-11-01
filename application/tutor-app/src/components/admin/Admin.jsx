//Author: Cleveland Plonsey
//admin should be able to get all users
//delete a user
//modify a user
//search up a specific user


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserResult from "./UserResult";
import "./admin.css";


const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userList, setUserList] = useState([]);
  const [filters, setFilters] = useState([
    {name: "Only tutors", isChecked:false, test: user => user.istutor},
    {name: "Only students", isChecked:false, test: user => !user.istutor},
    {name: "Pending", isChecked:false, test: user => user.ispending}
   ]);
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
  }, [navigate]);


  const applyFilters = (userList) =>{
    return userList.filter((user) =>{
      for(let i =0; i< filters.length; i++){
        if( filters[i].isChecked && !filters[i].test(user)){
          return false;
        }
      }
      return true;
    });
  }

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
      setUserList([...applyFilters(res.data.searchResults)]);
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
      setUserList([...applyFilters(res.data.allUsers)]);
    }
  };

  const handleFilterChange = (index) =>{
    filters[index].isChecked = !filters[index].isChecked;
    setFilters([...filters]);
    setUserList([...applyFilters(userList)]);
  }

  return (
    <div className="admin-box">
       <div className="filter-box">
       <p><strong>Filter by:</strong></p>
          {
            filters.map((filter, index) =>{
              return (
              <div>
                 <label htmlFor={filter.name}>{filter.name}</label>
                 <input 
                  type="checkbox" 
                  name={filter.name}
                  checked={filter.isChecked}
                  index={index}
                  key={index}
                  onChange={() => {handleFilterChange(index)}}
                  />
              </div>
              );
            })
          }
        </div>
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
                isPending={user.ispending}
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
