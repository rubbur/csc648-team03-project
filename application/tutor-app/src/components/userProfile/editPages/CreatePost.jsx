import React, { useEffect, useState } from "react";
import "./editPage.scss";
import axios from "axios";
import { cookie } from "../../../App";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const characterLimit = 1000; //this is the max number of characters allowed in the post description
  //and it must match the character limit (the VARCHAR set in the description column in the tutor_post table).

  const [postContent, setPostContent] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [flierFile, setFlierFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("NOT SELECTED");
  const [hourlyRate, setHourlyRate] = useState(20);
  const [name, setName] = useState("");
  const subjectList = ["NOT SELECTED", "CS", "Math", "Physics", "Sociology", "Spanish", "Music", "Theater"];

  const handleClear = () => { // clear all the fields
    setPostContent("");
    setPdfFile(null);
    setFlierFile(null);
    setVideoFile(null);
    setSelectedSubject("NOT SELECTED");
    setHourlyRate(20);
    setName("");

    // remove the file names from the file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = "";
    });
  };

  const handleFileUpload = async (file, updateColumn, postId) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("post_id", postId);
      formData.append("tutor_id", cookie.get("userId"));
      formData.append("username", cookie.get("userName"));
      formData.append("subject", selectedSubject);
      formData.append("name", name);
      formData.append("update_column", updateColumn);

      try {
        const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tutor/uploadFile`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (!result.data.success)
          console.error(`Error uploading ${updateColumn}:`, result.data.error);

      } catch (error) {
        console.error(`Error uploading ${updateColumn}:`, error);
      }
    }
  };

  // This function is called when the user clicks the "Create Post" button
  const handlePost = async () => {
    if (selectedSubject === "NOT SELECTED") {
      alert("Please select a subject");
      return;
    }
    if (postContent.length > characterLimit) {
      alert("Post description is too long");
      return;
    } else if (postContent.length === 0) {
      alert("Post description cannot be empty");
      return;
    }
    if (!cookie.get("isLoggedIn")) {
      window.open(`${window.location.origin}/SignIn`);
      //indicate that this new window is temporary
      localStorage.setItem("temporaryWindow", true);
      return;
    }
    if (hourlyRate < 15 || hourlyRate > 99.99) {
      alert("Hourly rate must be between $15 and $99.99");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/CreatePost`,
        {
          tutor_id: cookie.get("userId"),
          subject: selectedSubject,
          description: postContent,
          hourly_rate: hourlyRate,
          name: name,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const postId = response.data.postId;
        handleClear();

        // handle file uploads
        await Promise.all([
          handleFileUpload(pdfFile, "cv_url", postId),
          handleFileUpload(flierFile, "flier_url", postId),
          handleFileUpload(videoFile, "video_url", postId),
        ]);

        // Set isTutor to 1 in users table
        console.log("istutor: " + cookie.get("isTutor"));
        if (cookie.get("isTutor") === 0 || typeof cookie.get("isTutor") === "undefined") {
          console.log("Trying to update user to tutor");
          const tutorResponse = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/user/setIsTutor`,
            {
              userId: cookie.get("userId"),
            },
            { withCredentials: true }
          );

          if (tutorResponse.data.success) {
            cookie.set("isTutor", 1);
          } else {
            console.error("Failed to set isTutor:", tutorResponse.data.error);
          }
        }

        navigate("/tutorPostsView");
      } else {
        console.error("Failed to create the post:", response.data.error);
      }
    } catch (error) {
      console.error("Error making the POST request:", error);
    }
  };

  return (
    <div>
      <h1 className="post-header">Create Post</h1>
      <div className="post-textarea-container">
        <p className={(postContent.length > characterLimit) ? "error" : ""}>{` ${postContent.length}/${characterLimit} characters `}</p>
        <textarea
          className="post-textarea"
          placeholder="Write your post here"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
      </div>
      <div className="upload-container">
        <div className="upload-button-container">
          <div className="upload-input">
            <label>Your Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

      </div>
      <div className="upload-container">
        <div className="upload-button-container">
          <div className="upload-input">
            <label>Subject: </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjectList.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div className="upload-input">
            <label>Hourly Rate: $ </label>
            <input
              value={hourlyRate}
              type="number"
              min={15}
              max={100}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>
          <div className="upload-input">
            <span>Upload CV (PDF): </span>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
            />
          </div>
          <div className="upload-input">
            <span>Upload Flier (PDF): </span>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFlierFile(e.target.files[0])}
            />
          </div>
          <div className="upload-input">
            <span>Upload Video: </span>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
          </div>
        </div>
      </div>
      <div className="post-button-container">
        <button className="create-button" onClick={handlePost}>
          Create Post
        </button>
        <button className="create-button" onClick={handleClear}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
