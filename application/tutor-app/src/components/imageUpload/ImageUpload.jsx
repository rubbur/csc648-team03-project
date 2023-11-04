//Author: Cleveland Plonsey
//date: 9/12/2023
//purpose: This component allows the user to upload a profile picture
//it accepts a file and uploads it to the backend where the file is stored in a folder
//at the root of the public folder.
//and the backend updates the database with the relative path to the file

import axios from "axios";
import { useState } from "react";
import { cookie } from "../../App";
import "./imageUpload.css";

const ImageUpload = () => {
  const [imageFile, setImageFile] = useState("");

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handlePostImage = async () => {
    if (!cookie.get("isLoggedIn")) {
      alert("must be logged in to upload a file");
      return;
    }
    if (!imageFile) {
      alert("No file selected!");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(imageFile.type)) {
      alert("Only .jpeg, .jpg, or .png files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("id", cookie.get("userId"));
    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/user/uploadImage`,

      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          userId: cookie.get("userId"),
        },
        withCredentials: true,
      },
    );
    if (!result.data.success) {
      console.log("error uploading image: " + result.data.errorMessage);
    }
  };

  return (
    <div className="image-upload-box">
      <h1>Upload a Profile Picture</h1>

      <input
        type="file"
        name="file"
        onChange={handleImageChange}
        accept=".jpg, .jpeg, .png"
      />
      <button onClick={handlePostImage}>Upload</button>
      <p className="upload-disclaimer">
        Uploading media will place your account on hold <br />
        pending admin's approval of the uploaded content.
      </p>
    </div>
  );
};

export default ImageUpload;
