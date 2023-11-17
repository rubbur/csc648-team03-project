// Author:  Cleveland Plonsey
// Date: 10/2/2023
// Purpose: Is the view that shows the results of a user using search bar
// all tutor_posts that match the search criteria are displayed as post cards.

import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { cookie } from "./../../App";
import "./searchResults.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import comparators from "./algorithms";
import "./searchResults.scss";
import { Fade } from "react-awesome-reveal";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";

const SearchResults = () => {
  const location = useLocation(); //tracks the query params in the url
  const [resultsList, setResultsList] = useState([]);
  const [searchSubject, setSearchSubject] = useState("");
  const [sortType, setSortType] = useState("Price");
  const [sortDirection, setSortDirection] = useState(true); //true is ascending, false is descending
  const [topThreeTutors, setTopThreeTutors] = useState([]);
  //get the top three tutors of the site
  useEffect(() => {
    const getTopTutors = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/tutor/topThreeTutors`,
        {},
        { withCredentails: true },
      );
      if (response.data.success) {
        setTopThreeTutors([...response.data.data]);
      }
    };
    getTopTutors();
  }, []);

  //get the search results based on the query params
  useEffect(() => {
    const getSearchResults = async () => {
      //get the subject and the search term from the queryparams
      const url = new URL(window.location.href);

      const params = new URLSearchParams(url.search);
      // error if search is more than 40 characters
      if (params.get("searchterm").length > 40) {
        alert("Search term must be at most 40 characters");
        return;
      }

      const subject = params.get("subject") || "All";
      //if the subject is not specified, set it to overview so that the user can see the tutor's overview post

      setSearchSubject(subject === "all" ? "overview" : subject);
      const searchTerm = params.get("searchterm");

      //get the results from the backend
      const searchResults = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/searchPosts`,
        { subject: subject, searchTerm: searchTerm },
        { withCredentials: true },
      );

      setResultsList([...searchResults.data.searchResults]);
    };
    getSearchResults();
  }, [location.search]); //when the query params change (because the user searched something else) trigger loading the new search results

  const sortResults = () => {
    setResultsList([...resultsList.sort(comparators[sortType])]);
    if (!sortDirection) {
      setResultsList([...resultsList.reverse()]);
    }
    console.log(
      [...resultsList.sort(comparators[sortType])]
        .map((card) => card.avg_rating)
        .join(" "),
    );
  };

  return (
    <div className="search-results">
      <div className="sort-by-box">
        <h3 className="search-total">
          Showing {resultsList.length} search results
        </h3>
        {resultsList.length !== 0 && (
          <div className="sort-box">
            <div className="sort-by-title">
              <h3>Sort by:</h3>
            </div>
            <select
              value={sortType}
              className="sort-by"
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="Date">Date</option>
              <option value="Price">Price</option>
              <option value="Review">Review</option>
              <option value="Alpha">Alpha</option>
            </select>
            <button id="apply-sort-btn" onClick={sortResults}>
              Apply sort
            </button>
            <button
              id="sort-direction-btn"
              onClick={() => setSortDirection(!sortDirection)}
            >
              {sortDirection ? (
                <FontAwesomeIcon className="sort-icon" icon={faSortUp} />
              ) : (
                <FontAwesomeIcon className="sort-icon" icon={faSortDown} />
              )}
            </button>
            {/*<div className="sort-arrows">
              <FontAwesomeIcon className="sort-icon" icon={faSortUp} />
              <FontAwesomeIcon className="sort-icon" icon={faSortDown} />
            </div>*/}
          </div>
        )}
      </div>
      <div className="search-results-box">
        {resultsList.map((tutor, index) => {
          return (
            <Fade key={index}>
              <UserResult
                username={tutor.username}
                name={tutor.name}
                userId={tutor.tutor_id}
                imgUrl={tutor.img_url}
                avgRating={
                  tutor.avg_rating !== undefined
                    ? tutor.avg_rating.toFixed(1)
                    : "0.0"
                }
                key={index}
                index={index}
                subject={tutor.subject}
                rate={"$" + tutor.hourly_rate + "/hr"}
                postId={tutor.post_id}
                tutorId={tutor.tutor_id}
              />
            </Fade>
          );
        })}
      </div>
      {resultsList.length === 0 && (
        <div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <h2 className="recent-posts-text">Our three newest tutors</h2>
          <br />
          <hr />
          <div className="top-tutors-container">
            {topThreeTutors.length > 0 &&
              topThreeTutors.map((tutor, index) => (
                <UserResult
                  key={index}
                  name={tutor.name}
                  postId={tutor.post_id}
                  imgUrl={tutor.img_url}
                  subject={tutor.subject}
                  rate={tutor.hourly_rate}
                  tutorId={tutor.tutor_id}
                  avgRating={
                    tutor.avg_rating !== undefined
                      ? tutor.avg_rating.toFixed(1)
                      : "0.0"
                  }
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const UserResult = ({
  username,
  postId,
  imgUrl,
  subject,
  rate,
  tutorId,
  name,
  avgRating,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [messageInProgress, setMessageInProgress] = useState(""); //the message that the user is typing to send to the tutor
  const navigate = useNavigate(); //used to navigate to the tutor's profile page

  const handleProfile = () => {
    //navigate to the tutor's profile page
    window.open(`/tutorProfile?postId=${postId}`, "_blank");
  };

  const handleSend = async () => {
    if (messageInProgress === "" || messageInProgress === undefined) return;
    if (
      cookie.get("isLoggedIn") === "false" ||
      cookie.get("isLoggedIn") === undefined
    ) {
      // Save the unsent message to local storage
      localStorage.setItem("unsentMessage", messageInProgress);
      localStorage.setItem("unsentMessageRecipientId", tutorId);
      localStorage.setItem("unsentMessagePostId", postId);
      // Redirect to the signup page
      alert(
        "You need to be logged in to contact a tutor. You will be redirected to sign in.",
      );
      window.location.href = "/SignIn";
      return;
    }

    // User is logged in, proceed with sending the message
    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/user/sendMessage`,
      {
        recipientId: tutorId,
        message: messageInProgress,
        senderId: cookie.get("userId"),
        postId: postId,
      },
      { withCredentials: true },
    );
    if(result.data.success){
        //send a notification to the reciever
    const notificationRes = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/createNotification`, {
      userId: cookie.get("userId"),
       notificationName: `${cookie.get("userName")} sent you a message!`,
        recipientId: tutorId, 
        type: "messages",
        postId: postId,
    }, 
    {withCredentials: true});
    if (!notificationRes.data.success) {
      console.log("Error sending notification: " + notificationRes.data.errorMessage);
    }
    else {
      console.log("Error sending message: " + notificationRes.data.errorMessage);
    }
    
    setMessageInProgress(""); // clear the message box after sending the message
  }
}

  return (
    <div className="user-result">
      <div className="results-container">
        <img
          className="user-img"
          src={imgUrl}
          alt="pic"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/userImages/stockImage.png";
          }}
        />
        <p>{name}</p>
        <p className="rating">
          {avgRating}
          <FontAwesomeIcon icon={["fas", "star"]} className="star" />
        </p>
        <p>{subject}</p>
        <p>{rate}</p>
        <div className="search-button-container">
          <button className="result-button" onClick={handleProfile}>
            See Post
          </button>
          <button
            className="result-button"
            onClick={() => {
              setIsTyping(!isTyping);
            }}
          >
            {!isTyping ? "Message Tutor" : "Close Message"}
          </button>
        </div>
      </div>
      {isTyping && (
        <div className="message-container">
          <textarea
            className="message-box"
            rows="30"
            placeholder="begin typing.."
            value={messageInProgress}
            onChange={(e) => setMessageInProgress(e.target.value)}
          />
          <div className="message-button-container">
            <button
              className="send-message-button result-button"
              onClick={handleSend}
            >
              Send Message
            </button>
            <button
              className="result-button"
              onClick={() => setMessageInProgress("")}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
