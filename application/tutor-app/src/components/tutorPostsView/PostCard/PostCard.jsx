import React from "react";
import { Link } from "react-router-dom";
import "./postCard.scss";

const PostCard = ({ rate, subject, handleDelete, postId }) => {
    return (
        <div className="post-card">
            <div className="post-card-link">
                <Link to={`/tutorProfile?postId=${postId}`} className="post-card-link">
                    <h2 className="post-card-link">{subject}</h2>
                    <h3 className="post-card-link">${rate}/hr</h3>
                </Link>
            </div>
            <button className="delete-button" onClick={() => handleDelete(postId)}>
                X
            </button>
        </div>
    );
};

export default PostCard;
