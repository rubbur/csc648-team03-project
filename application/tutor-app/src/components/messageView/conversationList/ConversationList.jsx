// Author: Ava Albright, Michael Mathews, Cleveland Plonsey
// Date: 10/18/2023
// Purpose: renders all conversations that a user has. Controls the Conversation components



import "./conversationList.scss";
import { useState, useEffect } from "react";
import Conversation from "../conversation/Conversation";
import axios from "axios";
import { cookie } from "../../../App";

const ConversationList = ({ setThread }) => {
    const [convoList, setConvoList] = useState([]);
    const userId = cookie.get('userId');

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/user/getConversations`,
                    { userId },
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setConvoList(response.data.senderData);
                } else {
                    console.log("Error fetching conversations: " + response.data.errorMessage);
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
        console.log(convoList);
    }, []);

    return (
        <div className="ConversationList" >
            <h1>{cookie.get("userName")}'s Conversations</h1>
            {convoList.map((convo) => (
                <Conversation
                    threadId={convo.thread_id}
                    setThread={setThread}
                    key={convo.message_id}
                    message_id={convo.message_id}
                    img_url={convo.img_url}
                    name={convo.username}
                    postSubject={convo.subject}
                />
            ))}
        </div>
    );
};

export default ConversationList;
