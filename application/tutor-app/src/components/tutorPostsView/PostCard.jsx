const PostCard = ({ rate, subject }) => {
    return (
        <div className="post-card">
            <h2>{subject}</h2>
            <h3>${rate}/hr</h3>
        </div>
    );
};

export default PostCard;