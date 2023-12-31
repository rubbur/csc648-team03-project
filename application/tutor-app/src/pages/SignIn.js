// Author:  Cleveland Plonsey, team lead
// Date: 9/3/2023
// Purpose: component that presents login form to user.

import React, { useEffect, useState } from "react";
import "../index.scss";
import axios from "axios";
import { cookie } from "../App";
import { Link, useNavigate } from "react-router-dom";
import AuthError from "../components/authError/authError";

function SignIn() {
  useEffect(() => {
    document.title = "Tutors.tech: Sign In";
    if (localStorage.getItem("temporaryWindow") === "true") {
      setLoginDialogOpen(true);
      return;
    }
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [errorList, setErrorList] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // send email and password to backend
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/user/login`,
      { username: username, password: password },
      { withCredentials: true },
    );
    console.log(response.data);
    setUsername("");
    setPassword("");

    if (response.data.success) {
      //user successfully registered
      cookie.set("isLoggedIn", true);
      cookie.set("userName", response.data.username);
      cookie.set("isTutor", response.data.isTutor);
      cookie.set("userId", response.data.userId);

      // Check if there is an unsent message in local storage
      const unsentMessage = localStorage.getItem("unsentMessage");
      const unsentMessageRecipientId = localStorage.getItem(
        "unsentMessageRecipientId",
      );
      const unsentMessagePostId = localStorage.getItem("unsentMessagePostId");

      if (unsentMessage && unsentMessageRecipientId && unsentMessagePostId) {
        // Ask the user if they want to send the unsent message
        const confirmSend = window.confirm(
          "You have an unsent message. Do you want to send it now?",
        );
        if (confirmSend) {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/user/sendMessage`,
            {
              recipientId: unsentMessageRecipientId,
              message: unsentMessage,
              senderId: cookie.get("userId"),
              postId: unsentMessagePostId,
            },
            { withCredentials: true },
          );

          console.log("Sent unsent message: " + response.data);
        }
      }

      // Remove any unsent message item from local storage
      localStorage.removeItem("unsentMessage");
      localStorage.removeItem("unsentMessageRecipientId");
      localStorage.removeItem("unsentMessagePostId");

      // check if there is an unsent review
      const unsentReview = localStorage.getItem("unsentReview");
      const unsentReviewRecipientId = localStorage.getItem(
        "unsentReviewRecipientId",
      );
      const unsentReviewPostId = localStorage.getItem("unsentReviewPostId");
      const unsentReviewRating = localStorage.getItem("unsentReviewRating");

      if (
        unsentReview &&
        unsentReviewRecipientId &&
        unsentReviewPostId &&
        unsentReviewRating
      ) {
        // Ask the user if they want to send the unsent review
        const confirmSend = window.confirm(
          "You have an unsent review. Do you want to send it now?",
        );
        if (confirmSend) {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/user/submitReview`,
            {
              tutorId: unsentReviewRecipientId,
              reviewText: unsentReview,
              reviewerId: cookie.get("userId"),
              reviewerName: cookie.get("userName"),
              postId: unsentReviewPostId,
              rating: unsentReviewRating,
            },
            { withCredentials: true },
          );
          console.log("Sent unsent review: " + response.data);
        }
      }

      // Remove any unsent review item from local storage
      localStorage.removeItem("unsentReview");
      localStorage.removeItem("unsentReviewRecipientId");
      localStorage.removeItem("unsentReviewPostId");
      localStorage.removeItem("unsentReviewRating");

      if (localStorage.getItem("temporaryWindow")) {
        localStorage.removeItem("temporaryWindow");
        window.close();
      }
      navigate("/Profile");
    } else {
      setErrorList(response.data.error);
    }
  };

  return (
    <div>
      <h1 className="pageHeader">Sign In</h1>
      {loginDialogOpen ? (
        <p className="not-logged-in" id="not-logged-in">
          You must be logged in to create a post
        </p>
      ) : null}
      <div className="form-set">
        <div className="form-group">
          <label htmlFor="username" className="no-select">
            SFSU Email:{" "}
          </label>
          <input
            type="username"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="no-select">
            Password:{" "}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rememberMe" className="no-select">
            Remember me:
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
          </label>
        </div>
        <div className="center-button">
          <button type="submit" onClick={handleLogin}>
            Sign In
          </button>
        </div>
        <div className="center-button">
          <button type="submit">Forgot Password?</button>
        </div>
        <Link to="/SignUp" className="suggest-signup">
          Don't have an account?<br></br>Click here to create one
        </Link>
      </div>
      {errorList.length > 0 && (
        <AuthError error={errorList} setErrorList={setErrorList} />
      )}
    </div>
  );
}

export default SignIn;
