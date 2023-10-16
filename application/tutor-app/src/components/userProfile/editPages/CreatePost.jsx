import React, { useState } from "react";
import "./editPage.scss";
import axios from "axios";

const CreatePost = () => {
  const [postContent, setPostContent] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const handleClear = () => {
    setPostContent("");
    setPdfFile(null);
    setImageFile(null);
    setVideoFile(null);
  };

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("content", postContent);
    formData.append("pdfFile", pdfFile);
    formData.append("imageFile", imageFile);
    formData.append("videoFile", videoFile);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/CreatePost`,
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
        <div className="button-container">
          <div className="upload-input">
            <span>Upload CV (PDF): </span>
            <input
              className="file-input"
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
            />
          </div>
          <div className="upload-input">
            <span>Upload Flier Image: </span>
            <input
              className="file-input"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>
          <div className="upload-input">
            <span>Upload Video: </span>
            <input
              className="file-input"
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
