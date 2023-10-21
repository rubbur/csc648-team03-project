import React, { useState } from "react";
import "./tutorPostsView.scss";
import axios from "axios";
import { cookie } from "../../App";
import { useEffect } from "react";
import PostCard from "./PostCard/PostCard";
import { Link } from "react-router-dom";

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
    const handleDelete = async (postId, subject) => {
        const confirmation = window.confirm("Are you sure you want to delete this post for " + subject + "?");
        if (confirmation) {
            const result = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/tutor/deletePost`,
                { postId: postId },
                { withCredentials: true }
            );
            if (!result.data.success) {
                console.log(result.data.errorMessage);
                console.log("Could not delete post");
                return;
            }
            setPostsList(PostsList.filter((post) => post.post_id !== postId));
        }
    };

    return (
        <div className="tutor-posts-view">
            <h1>Current Posts:</h1>
            {PostsList.length > 0 ?
                <></>
                : <h1>You have no posts, <Link to="/CreatePost" className="link-create-post">click here</Link> to create one.</h1>}

            <div className="posts-container">
                {PostsList.map((post, index) => (
                    <PostCard key={index} rate={post.hourly_rate} subject={post.subject} handleDelete={() => handleDelete(post.post_id, post.subject)} postId={post.post_id} />
                ))}
            </div>
        </div>
    );
};

export default TutorPostsView;