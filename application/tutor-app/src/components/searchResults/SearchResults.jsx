import { useState, useEffect } from "react"
import axios from "axios";
//import "../admin/admin.css";
import { useLocation, useNavigate } from 'react-router-dom';
import cookie from "./../../App";
import "./searchResults.css";

const SearchResults = () =>{
    const [resultsList, setResultsList] = useState([]);
    const [searchSubject, setSearchSubject] = useState("");
    const location = useLocation(); //tracks the query params


    //get the search results based on the query params
    useEffect(() =>{
        const getSearchResults = async () =>{
            //get the subject and the search term from the queryparams
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            const subject = params.get('subject');
            //if the subject is not specified, set it to overview so that the user can see the tutor's overview post
            
            setSearchSubject(subject === "all" ? "overview" : subject); 
            const searchTerm = params.get('searchterm');
            
            //get the results from the backend
            const searchResults = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/user/searchTutors`,
                {subject: subject, searchTerm: searchTerm}, 
                {withCredentials: true}
                );

            setResultsList([...searchResults.data.searchResults]);
        }
        getSearchResults();
    }, [location.search]); //when the query params change (because the user searched something else) trigger loading the new search results


    return (
        <div className="search-results">
            <h3>Showing {resultsList.length} search results</h3>
            <div className="search-results-box">
                {
                    resultsList.map( (tutor, index ) => {
                        return <UserResult username={tutor.username}
                        userId={tutor.id}
                        imgUrl={tutor.img_url}
                        key={index}
                        index={index}
                        searchSubject={searchSubject}
                        />
                    })
                }
            </div>
        </div>
    )

}


const UserResult = ({username, userId, imgUrl, searchSubject }) => {
    const [isTyping, setIsTyping] = useState(false);
    const [messageInProgress, setMessageInProgress] = useState(""); //the message that the user is typing to send to the tutor
    const navigate = useNavigate(); //used to navigate to the tutor's profile page
    const handleContact = () => {
        //TODO send a message to the tutor
    }
    const handleProfile = () => {
        //navigate to the tutor's profile page
        navigate(`/tutorProfile?user=${username}&subject=${searchSubject}`);
    }

    const handleSend = async  () => {
        if(cookie.get("isLoggedIn") === "false"){
            //redirect to login page
            alert("need to be logged in to contact a tutor");
            return;
        }
        //TODO send the message to the tutor
    }

    return (
    <div className = "user-result">
            <div className="results-container">
                 <img className="user-img" src={imgUrl} alt="pic"/>
                 <p>{username}</p>
                 <button onClick={handleProfile}>See Profile</button>
                 <button onClick={() => {setIsTyping(!isTyping)}}>{!isTyping ? "Contact" : "Close Chat"}</button>
            </div>
           { isTyping && 
           <div className="message-box">
                <textarea rows="30" placeholder="message" value={messageInProgress} onChange={e => setMessageInProgress(e.target.valu)}/>
                <div className="flex-row">
                 <button className="send-message-button" onClick={handleSend}>Send Message</button>
                 <button onClick={() => setMessageInProgress("")}>Clear</button>
                </div>
            </div>
            }
    </div>
    );


}

export default SearchResults;