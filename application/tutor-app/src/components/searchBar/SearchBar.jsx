import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./searchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const subjectList = ["All", "CS", "Math", "Physics", "Sociology", "Spanish", "Music", "Theater"];

const SearchBar = () => {
    const [subject, setSubject] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();


    useEffect(() =>{
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const subjectParam = params.get('subject');
        const searchTermParam = params.get('searchterm');
        if(subjectParam){
            setSubject(subjectParam);
        }
        if(searchTermParam){
            setSearchTerm(searchTermParam);
        }
    }, []);

    const handleSubjectChange = (e) =>{
        setSubject(e.target.value);
    }
    const handleChange = (e) =>{
        setSearchTerm(e.target.value);
    } 

    const handleSearch =  () =>{
        if(subject === "All" && searchTerm === ""){
            alert("enter some search criteria first");
            return;
        }
        navigate(`/searchResults?searchterm=${searchTerm}&subject=${subject}`);
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="searchbar">
            <select className="subject-dropdown" value={subject} onChange={handleSubjectChange} >
            {
                subjectList.map( (sub, index) => <option key={index} value={sub}>{sub}</option>)
            }
            </select>
            <input type="text" className="search-bar-input" placeholder="Search Tutors.tech" onKeyPress={handleKeyPress} value={searchTerm} onChange={handleChange}/>
            <button id="search-button" onClick={handleSearch}><FontAwesomeIcon icon = "magnifying-glass"/></button>
        </div>
    )
}

export default SearchBar;