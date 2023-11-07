// Author: Ava Albert, Michael Mathews, Cleveland Plonsey
// Date: 10/18/2023
// Purpose: renders all conversations that a user has as conversation cards on the left.
//on the right of the view, the current conversation that the user has selected.

import "./messageView.scss";
import ConversationList from "./conversationList/ConversationList";
import MessageThread from "./messageThread/MessageThread";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { cookie } from "../../App";

const MessageView = () => {
  const [thread, setThread] = useState("");
  const [person, setPerson] = useState({}); //[name, img_url
  const [convoMap, setConvoMap] = useState({});
  useEffect(() => {
    //get all the conversations
    const getConvoMap = async () => {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/getConversations`,
        { userId: cookie.get("userId") },
        { withCredentials: true },
      );
      if (!res.data.success) {
        console.log("Error fetching conversations: " + res.data.errorMessage);
      }
      setConvoMap(res.data.conversations);
    };
    getConvoMap();
  }, []);

  return (
    <div className="MessageView">
      <ConversationList setThread={setThread} setPerson={setPerson} />
      <MessageThread person={person} msgs={convoMap[thread] || []} />
    </div>
  );
};
export default MessageView;
