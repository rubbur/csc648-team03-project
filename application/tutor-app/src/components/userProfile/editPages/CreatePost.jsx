import React, { useState } from "react";
import "./editPage.scss";
import axios from "axios";
import { cookie } from "../../../App";

const CreatePost = () => {

  const characterLimit = 1000; //this is the max number of characters allowed in the post description
  //and it must match the character limit (the VARCHAR set in the description column in the tutor_post table).

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
    if (selectedSubject === "NOT SELECTED") {
      alert("Please select a subject");
      return;
    }
    if (postContent.length > characterLimit) {
      alert("Post description is too long");
      return;
    }
    if (!cookie.get("isLoggedIn")) {
      alert("Must be logged in to create a post.");
      return;
    }
    if (hourlyRate < 15 || hourlyRate > 100) {
      alert("Hourly rate must be between $15 and $100");
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
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Extract the post ID from the response
        const postId = response.data.postId;

        // Handle the successful response for creating the post

        // Reset the form fields and state
        setPostContent("");
        setSelectedSubject("NOT SELECTED");
        setHourlyRate(20);
        handleClear();

        // Now, you can make individual POST requests for each file type
        const fileUploadRequests = [];

        if (pdfFile) {
          const pdfData = new FormData();
          pdfData.append("file", pdfFile);
          pdfData.append("post_id", postId); // Include post_id
          pdfData.append("tutor_id", cookie.get("userId")); // Include tutor_id
          pdfData.append("username", cookie.get("userName")); // Include username
          console.log("APPENDING PDF USERNAME" + cookie.get("userName"));

          fileUploadRequests.push(
            axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/tutor/uploadFile`,
              pdfData,
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
          );
        }

        if (imageFile) {
          const imageData = new FormData();
          imageData.append("file", imageFile);
          imageData.append("post_id", postId); // Include post_id
          imageData.append("tutor_id", cookie.get("userId")); // Include tutor_id
          imageData.append("username", cookie.get("username")); // Include username

          fileUploadRequests.push(
            axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/tutor/uploadFile`,
              imageData,
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
          );
        }

        if (videoFile) {
          const videoData = new FormData();
          videoData.append("file", videoFile);
          videoData.append("post_id", postId); // Include post_id
          videoData.append("tutor_id", cookie.get("userId")); // Include tutor_id
          videoData.append("username", cookie.get("username")); // Include username

          fileUploadRequests.push(
            axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/tutor/uploadFile`,
              videoData,
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
          );
        }

        try {
          await Promise.all(fileUploadRequests); // Wait for all file uploads to complete
        } catch (error) {
          console.error("Error uploading files:", error);
        }
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
          Reset
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
