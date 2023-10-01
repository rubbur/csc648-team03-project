import axios from "axios";
import { useState } from "react"
import { cookie } from "../../App";
import "./imageUpload.css";

const ImageUpload = () =>{
    const [imageFile, setImageFile] = useState("");

    const handleImageChange = (e) =>{
        setImageFile(e.target.files[0]);
    }

    const handlePostImage = async () =>{
        console.log(cookie.get("username"));
        if(!cookie.get("isLoggedIn")){
            alert("must be logged in to upload a file");
            return;
        }
        if(!imageFile){
            alert("No file selected!");
            return;
        }
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('username', cookie.get("userName"));
        const result = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/uploadImage`, 
        
        formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            params: {
                username: cookie.get("username")
              },
            withCredentials: true
          });
        if(!result.data.success){
            console.log("error uploading image: " + result.data.errorMessage);
        }
    }


    return (
        <div className="image-upload-box">
            <h1>Upload a Profile Picture</h1>
            
            <input type="file" name="file" onChange={handleImageChange}/>
            <button onClick={handlePostImage}>Upload</button>
            <p className="upload-disclaimer">Uploading media will place your account on hold <br/> 
            pending admin's approval of the uploaded content.</p>
        </div>
    )
}

export default ImageUpload;