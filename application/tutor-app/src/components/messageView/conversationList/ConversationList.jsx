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
                console.log("Fetching conversations for user: " + userId);
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/user/getConversations`,
                    { userId },
                    { withCredentials: true }
                );
                if (response.data.success) {
                    // Set otherPersonId for each conversation in the list
                    const updatedConvoList = response.data.messages.map((convo) => {
                        if (convo.sender_id === userId) {
                            convo.otherPersonId = convo.recipient_id;
                        } else {
                            convo.otherPersonId = convo.sender_id;
                        }
                        return convo;
                    });

                    setConvoList(updatedConvoList);
                    console.log(response.data.messages[0].message_text);
                } else {
                    console.log("Error fetching conversations: " + response.data.errorMessage);
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        const fetchDataForConvo = async (convo) => {
            try {
                console.log("Fetching username for user: " + convo.otherPersonId);
                const usernameResponse = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/user/getUserDataById`,
                    { userId: convo.otherPersonId },
                    { withCredentials: true }
                );

                console.log("Fetching post subject for post: " + convo.post_id);
                const postResponse = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/tutor/getPostById`,
                    { postId: convo.post_id },
                    { withCredentials: true }
                );

                if (usernameResponse.data.success) {
                    if (usernameResponse.data.userData.length > 0) {
                        convo.otherPersonUsername = usernameResponse.data.userData[0].username;
                        console.log("Username fetched: " + usernameResponse.data.userData[0].username);
                    } else {
                        console.log("No user data found.");
                    }
                } else {
                    console.log("Error fetching username: " + usernameResponse.data.errorMessage);
                }

                if (postResponse.data.success) {
                    convo.postSubject = postResponse.data.postData[0];
                    console.log("Post subject fetched: " + postResponse.data.postData[0]);
                } else {
                    console.log("Error fetching post subject: " + postResponse.data.errorMessage);
                }

                return convo;
            } catch (error) {
                console.error("Error fetching data:", error);
                return convo;
            }
        };

        const updateConvoListData = async () => {
            const updatedConvoList = [];
            for (const convo of convoList) {
                const updatedConvo = await fetchDataForConvo(convo);
                updatedConvoList.push(updatedConvo);
            }
            setConvoList(updatedConvoList);
        };

        fetchConversations();
        if (convoList.length > 0) {
            updateConvoListData();
        }
    }, [userId]);

    return (
        <div className="ConversationList">
            <h1>{cookie.get("userName")}'s Conversations</h1>
            {convoList.map((convo) => (
                <Conversation
                    key={convo.message_id}
                    message_id={convo.message_id}
                    img_url={convo.img_url}
                    name={convo.otherPersonUsername}
                    postSubject={convo.postSubject}
                />
            ))}
        </div>
    );
};

export default ConversationList;
