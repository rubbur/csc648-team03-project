import "./conversation.scss";

const Conversation = ({ img_url, name, postSubject }) => {
    return (
        <div className="ConversationContainer">
            <div className="Conversation">
                <img src={process.env.PUBLIC_URL + img_url} alt={name + "'s profile picture"} />
                <p>{name}</p>
                <p>{postSubject}</p>
            </div>
        </div>
    );
};

export default Conversation;
