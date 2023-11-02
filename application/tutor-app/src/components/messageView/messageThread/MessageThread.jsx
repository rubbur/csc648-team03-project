// Author: Ava Albert, Michael Mathews, Cleveland Plonsey
// Date: 10/18/2023
// Purpose: renders all messages in a conversation

import "./messageThread.scss";
import { cookie } from "../../../App";
import { useEffect, useState } from "react";
import axios from "axios";

const MessageThread = ({ msgs, person }) => {
  const [messageList, setMessageList] = useState(msgs || []);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    let reversedMsgs = msgs ? [...msgs].reverse() : [];
    setMessageList([...reversedMsgs]);
  }, [msgs]);

  const sendMessage = async () => {
    if (newMessage.length === 0) {
      return;
    }
    //determine the sender and recipient ids
    const senderId = cookie.get("userId");
    const recipientId =
      msgs[0].thread_id.split("_")[0] == senderId
        ? msgs[0].thread_id.split("_")[1]
        : msgs[0].thread_id.split("_")[0];
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/user/sendMessage`,
      {
        threadId: msgs[0].thread_id,
        senderId: senderId,
        message: newMessage,
        recipientId: recipientId,
        postId: msgs[0].thread_id.split("_")[2],
      },
      { withCredentials: true },
    );

    if (res.data.success) {
      setNewMessage("");
      setMessageList([
        ...messageList,
        {
          sender_id: cookie.get("userId"),
          message_text: newMessage,
          date_stamp: new Date().toISOString().slice(0, 19).replace("T", " "),
        },
      ]);
    } else {
      console.log("Error sending message: " + res.data.errorMessage);
    }
  };

  return messageList.length !== 0 ? (
    <div className="message-thread">
      <header>
        <h1>{person.name}</h1>
        <img className="header-img" src={person.imgUrl} alt="" />
      </header>
      <div className="message-box">
        {messageList &&
          messageList.map((msg, index) => {
            let formattedDate = msg.date_stamp.split(/[- :]/);
            formattedDate =
              formattedDate[1] +
              "/" +
              formattedDate[2].split("T")[0] +
              "/" +
              formattedDate[0];
            const author =
              msg.sender_id === cookie.get("userId") ? "self" : "other";
            return (
              <Message
                key={index}
                timeStamp={formattedDate}
                author={author}
                text={msg.message_text}
              />
            );
          })}
        {msgs && (
          <div className="chat-box">
            <input
              className="chat-input"
              type="text"
              placeholder="Start Typing..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export const Message = ({ text, author, timeStamp }) => {
  const isImage = text.substring(0,8) == "https://";
  return (
    <div className={`message ${author}`}>
      { isImage ? <img className="msg-img" src={text} alt="" /> : <p className="msg-text">{text}</p> }
      <p className="msg-time">{timeStamp}</p>
    </div>
  );
};

export default MessageThread;
