import { useState } from "react";
import "./editPage.scss";
//import { cookie } from "../../../App";
import axios from "axios";

const CreatePost = () => {
    const [postContent, setPostContent] = useState("");

    //clears the text area
    const handleClear = () => {
        setPostContent("");
    }
  
    const handlePost = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/CreatePost`,
          {
            content: postContent,
          },
          {
            withCredentials: true,
          }
        );
  
        if (response.data.success) {
          setPostContent(""); 
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
        <div className="post-area">
            <textarea
                className="post-textarea"
                placeholder="Write your post here"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
            />
        </div>
        <div className="post-button-container">
            <button className="create-button" onClick={handlePost}>Create Post</button>
            <button className="create-button" onClick={handleClear}>Clear</button>
        </div>
      </div>
    );
  };
  
  export default CreatePost;