// Author:  Cleveland Plonsey, team lead
// Date: 9/3/2023
// Purpose: component that presents register form to user.

import React, { useEffect, useState } from "react";
import "../index.scss";
import axios from "axios";
import { cookie } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { set } from "react-ga";

function SignUp() {
  useEffect(() => {
    document.title = "Tutors.tech: Sign Up";
  }, []);

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleacceptTermsChange = (e) => {
    setAcceptTerms(e.target.checked);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const HandleRegistration = async () => {
   setErrorMessage("");

    if (!acceptTerms) {
      alert("Please accept the terms of service");
      // Don't send the request to the backend if terms are not accepted
      return;
    }

    if (!username.endsWith("@sfsu.edu") || username.length < 10) {
      alert("Please use a SFSU email address. Example email: example@sfsu.edu");
      return;
    }

    if (password.trim() === "") {
      alert("Password cannot be empty.");
      return;
    }

    // Send email and password to the backend
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/user/register`,
      { username: username, password: password },
      { withCredentials: true },
    );
    console.log(response.data);
    setUsername("");
    setPassword("");

    if (response.data.success) {
      // User successfully registered
      const { userId, username } = response.data;

      // Set user data in the cookie
      cookie.set("isLoggedIn", true);
      cookie.set("userName", username);
      cookie.set("userId", userId);

      console.log(cookie.get("userName"));
      console.log(cookie.get("isLoggedIn"));

      const unsentMessage = localStorage.getItem("unsentMessage");
      const unsentMessageRecipientId = localStorage.getItem(
        "unsentMessageRecipientId",
      );
      const unsentMessagePostId = localStorage.getItem("unsentMessagePostId");

      if (unsentMessage && unsentMessageRecipientId && unsentMessagePostId) {
        // User has an unsent message, recipient, and post ID
        // Send the message now
        const result = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/user/sendMessage`,
          {
            recipientId: unsentMessageRecipientId,
            message: unsentMessage,
            senderId: userId, // Use the retrieved userId
            postId: unsentMessagePostId,
          },
          { withCredentials: true },
        );
        console.log("Sent unsent message: " + result.data);
        localStorage.removeItem("unsentMessage");
        localStorage.removeItem("unsentMessageRecipientId");
        localStorage.removeItem("unsentMessagePostId");
      }

      if (localStorage.getItem("temporaryWindow")) {
        localStorage.removeItem("temporaryWindow");
        window.close();
      }

      navigate("/Profile");
    }
    else{
      setErrorMessage(response.data.error);
    }
  };

  return (
    <div>
      <h1 className="pageHeader">Sign Up</h1>
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
          <span className="required"> *</span>
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
          <span className="required"> *</span>
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
        <div className="form-group no-select">
          <label htmlFor="acceptTerms">
            <div>
              <span className="accept-text">Accept </span>
              <Link className="terms-link">Terms of Service</Link>:
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={acceptTerms}
                onChange={handleacceptTermsChange}
              />
              <span className="required"> *</span>
            </div>
          </label>
        </div>
        <div className="center-button">
          <button onClick={HandleRegistration}>Sign Up</button>
        </div>

        <p className="required">* Required</p>
      </div>
      <div className="error-box">
        <p className="error-p">{errorMessage}</p>
      </div>
    </div>
  );
}

export default SignUp;
