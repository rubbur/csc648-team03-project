//Author: Ava Albright
//Date: 10/20/2023
//purpose: Displays a conversation card that when clicked opens a list of messages in the conversation


import "./conversation.scss";

const Conversation = ({ img_url, name, postSubject, setThread, threadId }) => {
    return (
        <div className="ConversationContainer" onClick={() => { console.log("thread id: " + threadId); setThread(threadId) }}>
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
