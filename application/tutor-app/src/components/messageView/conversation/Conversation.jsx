import "./conversation.scss";

const Conversation = ({ img_url, name, postSubject }) => {
    return (
        <div className="ConversationContainer">
            <div className="Conversation">
                <div className="user-container">
                    <img src={process.env.PUBLIC_URL + img_url} alt={name + "'s profile picture"} />
                    <p>{name}</p>
                </div>
                <p>{"Subject: " + postSubject}</p>
            </div>
        </div>
    );
};

export default Conversation;
