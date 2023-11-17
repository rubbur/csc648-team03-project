// Author: Cleveland Plonsey
// Date: 10/4/2023
// Purpose: search bar that appears in the header on every page. Meant to look like amazon search bar
//has a filter and a text input that both are applied to the database.
//The tutor_posts table is queried using LIKE % AND subject =

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./searchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const SearchBar = () => {
  const [subject, setSubject] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectList, setSubjectList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const subjectParam = params.get("subject");
    const searchTermParam = params.get("searchterm");
    if (subjectParam) {
      setSubject(subjectParam);
    }
    if (searchTermParam) {
      setSearchTerm(searchTermParam);
    }
    // load subjectList
    const getSubjectList = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/user/getSubjects`,
          {},
          {
            withCredentials: true,
          },
        );
        if (response.data.success) {
          setSubjectList(response.data.subjectList);
        } else {
          console.error("Error getting subject list:", response.data.error);
        }
      } catch (error) {
        console.error("Error getting subject list:", error);
      }
    };
    getSubjectList();
  }, []);

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    // if(subject === "All" && searchTerm === ""){
    //     alert("enter some search criteria first");
    //     return;
    // }
    navigate(`/searchResults?searchterm=${searchTerm}&subject=${subject}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="searchbar">
      <select
        className="subject-dropdown"
        value={subject}
        onChange={handleSubjectChange}
      >
        {subjectList.map((sub, index) => (
          <option key={index} value={sub}>
            {sub}
          </option>
        ))}
      </select>
      <input
        type="text"
        className="search-bar-input"
        placeholder="Search Tutors.tech"
        onKeyPress={handleKeyPress}
        value={searchTerm}
        onChange={handleChange}
      />
      <button id="search-button" onClick={handleSearch}>
        <FontAwesomeIcon icon="magnifying-glass" />
      </button>
    </div>
  );
};

export default SearchBar;
