import "./conversationList.scss";
import { useState, useEffect } from "react";
import Conversation from "../conversation/Conversation";
import axios from "axios";
import { cookie } from "../../../App";

const ConversationList = () => {
    const [convoList, setConvoList] = useState([]);
    const userId = cookie.get('userId');

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/getConversations`,
                    { userId },
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setConvoList(response.data.messages);
                } else {
                    console.log("Error fetching conversations: " + response.data.errorMessage);
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
    }, [userId]);

    return (
        <div className="ConversationList">
            <h1>Conversations</h1>
            {convoList.map((convo) => (
                <Conversation name={convo.name} postSubject={convo.postSubject} key={convo.id} />
            ))}
        </div>
    );
};

export default ConversationList;
