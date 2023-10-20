import "./conversationList.scss";
import { useState, useEffect } from "react";
import Conversation from "../conversation/Conversation";
import axios from "axios";
import { cookie } from "../../../App";

const ConversationList = () => {
    const [convoList, setConvoList] = useState([]);
    const [otherPersonUsername, setOtherPersonUsername] = useState("");
    const [otherPersonId, setOtherPersonId] = useState("");
    const [postSubject, setPostSubject] = useState("");
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
                    } else {
                        setOtherPersonId(response.data.messages[0].sender_id);
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
                        console.log("Username fetched: " + response.data.userData[0].username);
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

        const getPostSubject = async () => {
            if (convoList.length > 0) {
                try {
                    console.log("Fetching post subject for post: " + convoList[0].post_id);
                    const response = await axios.post(
                        `${process.env.REACT_APP_BACKEND_URL}/tutor/getPostById`,
                        { postId: 66 },
                        { withCredentials: true }
                    );
                    console.log("SUCCESS");
                    if (response.data.success) {
                        setPostSubject(response.data.postData[0]);
                        console.log("Post subject fetched with id " + "66" + ": " + response.data.postData[0]);
                    } else {
                        console.log("Error fetching post subject: " + response.data.errorMessage);
                    }
                } catch (error) {
                    console.error("Error fetching post:", error);
                }
            }
        };

        fetchConversations();
        getUsername();
        getPostSubject();
        // print all elements of convoList
        convoList.forEach((convo) => {
            console.log(convo);
        }
        );
    }, [userId, otherPersonId]);

    return (
        <div className="ConversationList">
            <h1>{cookie.get("userName")}'s Conversations</h1>
            {convoList.map((convo) => (
                <Conversation message_id={convo.message_id} img_url={convo.img_url} name={otherPersonUsername} postSubject={convo.message_text} />
            ))}
        </div>
    );
};

export default ConversationList;
