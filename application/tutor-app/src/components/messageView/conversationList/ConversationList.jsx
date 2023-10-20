import "./conversationList.scss";
import { useState, useEffect } from "react";
import Conversation from "../conversation/Conversation";
import axios from "axios";
import { cookie } from "../../../App";

const ConversationList = () => {
    const [convoList, setConvoList] = useState([]);
    const [otherPersonUsername, setOtherPersonUsername] = useState("");
    const [otherPersonId, setOtherPersonId] = useState("");
    const userId = cookie.get('userId');

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                console.log("Fetching conversations for user: " + userId);
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/user/getConversations`,
                    { userId },
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setConvoList(response.data.messages);
                    if (response.data.messages[0].sender_id === userId) {
                        setOtherPersonId(response.data.messages[0].recipient_id);
                        console.log("other id: " + response.data.messages[0].recipient_id);
                    } else {
                        setOtherPersonId(response.data.messages[0].sender_id);
                        console.log("other id: " + response.data.messages[0].sender_id);
                    }
                    console.log(response.data.messages[0].message_text);
                } else {
                    console.log("Error fetching conversations: " + response.data.errorMessage);
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        const getUsername = async () => {
            try {
                console.log("Fetching username for user: " + otherPersonId);
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/user/getUserDataById`,
                    { userId: otherPersonId },
                    { withCredentials: true }
                );
                if (response.data.success) {
                    if (Array.isArray(response.data.userData) && response.data.userData.length > 0) {
                        setOtherPersonUsername(response.data.userData[0].username);
                        console.log(response.data.userData[0].username);
                    } else {
                        console.log("No user data found.");
                    }
                } else {
                    console.log("Error fetching username: " + response.data.errorMessage);
                }
            } catch (error) {
                console.error("Error fetching username:", error);
            }
        };

        fetchConversations();
        if (convoList.length > 0) {
            getUsername();
            console.log("OTHER PERSON USERNAME: " + otherPersonUsername);
        }
    }, [userId, otherPersonId, otherPersonUsername]);

    return (
        <div className="ConversationList">
            <h1>Conversations</h1>
            {convoList.map((convo) => (
                <Conversation key={convo.message_id} name={otherPersonUsername} conversation={convo.message_text} />
            ))}
        </div>
    );
};

export default ConversationList;
