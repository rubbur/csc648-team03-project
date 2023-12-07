// Author:  Cleveland Plonsey
// Date: 10/1/2023
// Purpose: the dashboard for a logged in user. The user can customize their account in this view

import { cookie } from "../../App";
import "./userProfile.scss";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ImageUpload from "../imageUpload/ImageUpload";
import TutorEdit from "./editPages/TutorEdit";
import PasswordEdit from "./editPages/PasswordEdit";
import NameEdit from "./editPages/NameEdit";
import SeeReviews from "./editPages/seeReviews";
import TutorPostsView from "../tutorPostsView/TutorPostsView";
import MessageView from "../messageView/MessageView";

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [editPage, setEditPage] = useState("messages");
  const [userName, setUserName] = useState(cookie.get("userName"));
  const [conversationId, setConversationId] = useState(""); //the id of the conversation that the user wants to see
  const location = useLocation();

  useEffect(() => {
    cookie.addChangeListener(() => {
      setUserName(cookie.get("userName"));
    });
    setUserName(cookie.get("userName"));

    const type = location.state?.type;
    setEditPage(type || "messages");
    setConversationId(location.state?.conversationId || "");
    console.log("the conversation id is: " + conversationId);
    console.log("the location state is: " + location.state?.conversationId);
  }, [location]);

  useEffect(() => {
    const loadUserData = async () => {
      //get the user data from the database

      const data = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/getUserDataById`,
        { userId: cookie.get("userId") },
        { withCredentials: true },
      );
      if (!data.data.success) {
        console.log(data.data.errorMessage);
        // navigate("/");
      } else {
        setUserData({ ...data.data.userData[0] });
      }
    };
    loadUserData();
  }, []);

  const handleCreatePost = async () => {
    //navigate to the create post page
    navigate("/CreatePost");
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account?",
    );
    if (confirmation) {
      // user clicked ok
      //delete this user's account
      const data = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/deleteAccount`,
        { username: cookie.get("userName") },
        { withCredentials: true },
      );
      if (data.data.success) {
        await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/Logout`,
          {},
          { withCredentials: true },
        );
        navigate("/Logout");
      }
    } else {
      // user clicked cancel
    }
  };

  const handleSeeMessages = async () => {
    //TODO: navigate to the messages page or something.
    //ask ava what she wants to do here
    navigate("/messages");
  };

  /*const handleSeeReviews = async () => {
        //TODO: navigate to the reviews page or something.
        //ask ava what she wants to do here
    }*/

  return (
    <div className="profile-container">
      <div className="profile">
        <div className="img-holder">
          <h1 className="header">{`${userName}`}</h1>
          <img
            className="user-image"
            src={userData.img_url}
            alt={userName + "'s profile picture."}
          />
        </div>
        <div className="edit-container">
          <div className="edit-box">
            <div className="button-container">
              <button
                className={`profile-edit-button ${
                  editPage === "messages" ? "pressed" : ""
                }`}
                onClick={() => {
                  setEditPage("messages");
                }}
              >
                See Messages
              </button>
              <button
                className={`profile-edit-button ${
                  editPage === "tutorposts" ? "pressed" : ""
                }`}
                onClick={() => {
                  setEditPage("tutorposts");
                }}
              >
                See Tutor Posts
              </button>
              {cookie.get("isTutor") === 1 && (
                <button
                  className={`profile-edit-button ${
                    editPage === "reviews" ? "pressed" : ""
                  }`}
                  onClick={() => {
                    setEditPage("reviews");
                  }}
                >
                  See Reviews
                </button>
              )}
              <button
                className={`profile-edit-button ${
                  editPage === "upload" ? "pressed" : ""
                }`}
                onClick={() => {
                  setEditPage("upload");
                }}
              >
                Upload Image
              </button>
              <button
                className={`profile-edit-button ${
                  editPage === "name" ? "pressed" : ""
                }`}
                onClick={() => {
                  setEditPage("name");
                }}
              >
                Update Username
              </button>
              <button
                className={`profile-edit-button ${
                  editPage === "password" ? "pressed" : ""
                }`}
                onClick={() => {
                  setEditPage("password");
                }}
              >
                Update Password
              </button>

              {/*(cookie.get("isTutor") === 1) && <button className={`profile-edit-button post-button`} onClick={handleSeeReviews}>See Reviews</button>*/}
            </div>
          </div>
          <div className="editting-box">
            {editPage === "messages" && (
              <MessageView conversationId={conversationId} />
            )}
            {editPage === "tutorposts" && <TutorPostsView isTutor={true} />}
            {editPage === "tutor" && <TutorEdit isTutor={false} />}
            {editPage === "name" && <NameEdit />}
            {editPage === "password" && <PasswordEdit />}
            {editPage === "reviews" && <SeeReviews />}
            {editPage === "edit-tutor" && <TutorEdit isTutor={true} />}
            {editPage === "upload" && <ImageUpload />}
          </div>
        </div>
      </div>
      <div className="danger-container">
        <div className="danger-field">
          <h2>Danger Field</h2>
          <button onClick={handleDeleteAccount} className="danger-button">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
