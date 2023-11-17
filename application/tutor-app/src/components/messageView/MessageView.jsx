// Author: Ava Albert, Michael Mathews, Cleveland Plonsey
// Date: 10/18/2023
// Purpose: renders all conversations that a user has as conversation cards on the left.
//on the right of the view, the current conversation that the user has selected.

import "./messageView.scss";
import ConversationList from "./conversationList/ConversationList";
import MessageThread from "./messageThread/MessageThread";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { cookie } from "../../App";
import styled from "styled-components";

const ConvoList = styled.div`
  display: ${({ showConvos }) => (showConvos ? "flex" : "none")};
  }
`;
const MsgThread = styled.div`
  display: ${({ showConvos }) => (showConvos ? "none" : "flex")};
  }
  flex-direction: column;
  align-items: center;
`;

const MessageView = ({conversationId}) => {
  const [thread, setThread] = useState(conversationId || "");
  const [person, setPerson] = useState({}); //[name, img_url
  const [convoMap, setConvoMap] = useState({});
  const [showConvos, setShowConvos] = useState(true);

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
      // setThread(conversationId || ""); 
    };
    getConvoMap();
  }, []);

  const displayConvos = () => {
    setShowConvos(true);
  };

  return (
    <div className="MessageView">
      <div className="MessageViewDesktop">
        <ConversationList
          setThread={setThread}
          setPerson={setPerson}
          setShowConvos={setShowConvos}
        />
        <MessageThread person={person} msgs={convoMap[thread] || convoMap[conversationId] || []} />
      </div>
      <div className="MessageViewMobile">
        <ConvoList showConvos={showConvos}>
          <ConversationList
            setThread={setThread}
            setPerson={setPerson}
            setShowConvos={setShowConvos}
          />
        </ConvoList>
        <MsgThread showConvos={showConvos}>
          <MessageThread person={person} msgs={convoMap[thread] || []} />
          <button onClick={displayConvos}>View Conversations</button>
        </MsgThread>
      </div>
    </div>
  );
};
export default MessageView;
