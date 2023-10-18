import React, { useState } from "react";
import "./tutorPostsView.scss";
import axios from "axios";
import { cookie } from "../../App";
import { useEffect } from "react";
import PostCard from "./PostCard/PostCard";

const TutorPostsView = () => {
    const [PostsList, setPostsList] = useState([]);
    useEffect(() => {
        const getPosts = async () => {
            const result = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/tutor/getPostByTutorId`,
                { tutorId: cookie.get("userId") },
                { withCredentials: true }
            );
            if (!result.data.success) {
                console.log(result.data.errorMessage);
                console.log("Could not get posts");
                return;
            }
            setPostsList([...result.data.postData]);
        };
        getPosts();
    }, []);

    return (
        <div className="tutor-posts-view">
            <h1>Current Posts:</h1>
            <div className="posts-container">
                {PostsList.map((post, index) => (
                    <PostCard key={index} rate={post.hourly_rate} subject={post.subject} />
                ))}
            </div>
        </div>
    );
};

export default TutorPostsView;