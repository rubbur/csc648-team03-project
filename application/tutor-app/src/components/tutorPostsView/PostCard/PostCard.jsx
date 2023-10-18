import "./postCard.scss";

const PostCard = ({ rate, subject }) => {
    return (
        <div className="post-card">
            <h2>{subject}</h2>
            <h3>${rate}/hr</h3>
            <button className="delete-button" onClick={() => console.log("delete")}>X</button>
        </div>
    );
};

export default PostCard;