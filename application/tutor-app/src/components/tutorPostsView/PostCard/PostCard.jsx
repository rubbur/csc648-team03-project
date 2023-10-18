import React from "react";
import { Link } from "react-router-dom";
import "./postCard.scss";

const PostCard = ({ rate, subject, handleDelete, postId }) => {
    return (
        <Link to={`/tutorProfile?postId=${postId}`} className="post-card">
            <h2>{subject}</h2>
            <h3>${rate}/hr</h3>
            <button className="delete-button" onClick={() => handleDelete(postId)}>
                X
            </button>
        </Link>
    );
};

export default PostCard;
