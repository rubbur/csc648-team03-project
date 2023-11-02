// Author: Ava Albert, Michael Mathews, Cleveland Plonsey
// Date: 10/18/2023
// Purpose: renders all conversations that a user has. Controls the Conversation components

import "./conversationList.scss";
import { useState, useEffect } from "react";
import Conversation from "../conversation/Conversation";
import axios from "axios";
import { cookie } from "../../../App";
import comparators from "./algorithms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";

//TODO: pass Conversation component time_stamp prop which is when the conversation was last active.
const ConversationList = ({ setThread, setPerson }) => {
  const [convoList, setConvoList] = useState([]);
  const [sortType, setSortType] = useState("Alpha");
  const userId = cookie.get("userId");
  const criteria = ["Alpha", "Recent"];

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/user/getConversations`,
          { userId },
          { withCredentials: true },
        );
        if (response.data.success) {
          setConvoList(response.data.senderData);
        } else {
          console.log(
            "Error fetching conversations: " + response.data.errorMessage,
          );
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    const fetchDataForConvo = async (convo) => {
      try {
        const usernameResponse = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/user/getUserDataById`,
          { userId: convo.otherPersonId },
          { withCredentials: true },
        );

        const postResponse = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/tutor/getPostById`,
          { postId: convo.post_id },
          { withCredentials: true },
        );

        if (usernameResponse.data.success) {
          if (usernameResponse.data.userData.length > 0) {
            convo.otherPersonUsername =
              usernameResponse.data.userData[0].username;
            convo.img_url = usernameResponse.data.userData[0].img_url;
          } else {
            console.log("No user data found.");
          }
        } else {
          console.log(
            "Error fetching username: " + usernameResponse.data.errorMessage,
          );
        }

        if (postResponse.data.success) {
          if (postResponse.data.postData.length > 0) {
            convo.postSubject = postResponse.data.postData[0].subject;
          } else {
            console.log("No post data found.");
          }
        } else {
          console.log(
            "Error fetching post subject: " + postResponse.data.errorMessage,
          );
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

    fetchConversations().then(() => {
      if (convoList.length > 0) {
        updateConvoListData();
      }
    });
  }, [userId, convoList.length, convoList.postSubject]);

  return (
    <div className="ConversationList">
      <h1>{cookie.get("userName")}'s Conversations</h1>
      {convoList.map((convo) => (
        <Conversation
          postId={convo.post_id}
          threadId={convo.thread_id}
          setThread={setThread}
          setPerson={setPerson}
          key={convo.message_id}
          message_id={convo.message_id}
          img_url={convo.img_url}
          name={convo.username}
          postSubject={convo.subject}
          date={convo.date_stamp}
        />
      ))}
    </div>
  );
};

export default ConversationList;
