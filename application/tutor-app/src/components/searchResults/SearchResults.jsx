import { useState, useEffect } from "react"
import axios from "axios";
//import "../admin/admin.css";
import { useLocation, useNavigate } from 'react-router-dom';
import {cookie} from "./../../App";
import "./searchResults.scss";

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
                `${process.env.REACT_APP_BACKEND_URL}/user/searchPosts`,
                {subject: subject, searchTerm: searchTerm},
                {withCredentials: true}
                );

            setResultsList([...searchResults.data.searchResults]);
            console.log(searchResults.data.searchResults[0]);
        }
        getSearchResults();
    }, [location.search]); //when the query params change (because the user searched something else) trigger loading the new search results


    return (
        <div className="search-results">
            <h3 className="search-total">Showing {resultsList.length} search results</h3>
            <div className="search-results-box">
                {
                    resultsList.map( (tutor, index ) => {
                        return <UserResult username={tutor.username}
                        userId={tutor.tutor_id}
                        imgUrl={tutor.img_url}
                        key={index}
                        index={index}
                        subject={tutor.subject}
                        rate={tutor.hourly_rate}
                        postId = {tutor.post_id}
                        />
                    })
                }
            </div>
        </div>
    )

}


const UserResult = ({username, postId, imgUrl, subject, rate }) => {
    const [isTyping, setIsTyping] = useState(false);
    const [messageInProgress, setMessageInProgress] = useState(""); //the message that the user is typing to send to the tutor
    const navigate = useNavigate(); //used to navigate to the tutor's profile page
  
    const handleProfile = () => {
        //navigate to the tutor's profile page
        navigate(`/tutorProfile?postId=${postId}`);
    }

    const handleSend = async  () => {
        if(cookie.get("isLoggedIn") === "false"){
            //redirect to login page
            alert("need to be logged in to contact a tutor");
            return;
        }
        //TODO send the message to the tutor
        const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/sendMessage`, {withCredentials: true});
    }

    return (
    <div className = "user-result">
            <div className="results-container">
                 <img className="user-img" src={imgUrl} alt="pic"/>
                 <p>{username}</p>
                 <p>{subject}</p>
                 <p>{rate}</p>
                 <div className="search-button-container">
                    <button className="result-button" onClick={handleProfile}>See Profile</button>
                    <button className="result-button" onClick={() => {setIsTyping(!isTyping)}}>{!isTyping ? "Message Tutor" : "Close Message"}</button>
                 </div>
            </div>
           { isTyping && 
           <div className="message-container">
                <textarea className="message-box" rows="30" placeholder="begin typing.." value={messageInProgress} onChange={e => setMessageInProgress(e.target.valu)}/>
                <div className="message-button-container">
                 <button className="send-message-button result-button" onClick={handleSend}>Send Message</button>
                 <button className="result-button" onClick={() => setMessageInProgress("")}>Clear</button>
                </div>
            </div>
            }
    </div>
    );


}

export default SearchResults;