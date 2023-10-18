import React, { useState } from "react";
import "./editPage.scss";
import axios from "axios";
import { cookie } from "../../../App";

const CreatePost = () => {
  const [postContent, setPostContent] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [hourlyRate, setHourlyRate] = useState(20);
  const subjectList = ["NOT SELECTED", "CS", "Math", "Physics", "Sociology", "Spanish", "Music", "Theater"];

  const handleClear = () => { // clear all the fields
    setPostContent("");
    setPdfFile(null);
    setImageFile(null);
    setVideoFile(null);
    setSelectedSubject("NOT SELECTED");
    setHourlyRate(20);

    // remove the file names from the file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = "";
    });
  };

  const handlePost = async () => {
    if(selectedSubject === "NOT SELECTED"){
      alert("Please select a subject");
      return;
    }
    if(!cookie.get("isLoggedIn")) {
      //TODO: store form data as json string in local storage
      //navigate("/Login");
      //for now just return
      alert("must be logged in to create a post. DEVS: Cash the todo in CreatePost.jsx");
      return;
    }
    const formData = new FormData();
    formData.append("tutor_id", cookie.get("userId"));
    formData.append("subject", selectedSubject);
    formData.append("description", postContent);
    formData.append("cv_url", pdfFile);
    formData.append("flier_url", imageFile);
    formData.append("video_url", videoFile);
    formData.append("hourly_rate", hourlyRate);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/CreatePost`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setPostContent("");
        setPdfFile(null);
        setImageFile(null);
        setVideoFile(null);
        setSelectedSubject("");
        setHourlyRate("");
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
            <span>Upload Flier Image: </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
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
          Clear All
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
