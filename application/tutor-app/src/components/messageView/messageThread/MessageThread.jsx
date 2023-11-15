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
                messageId={msg.message_id}
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

export const Message = ({ text, author, timeStamp, messageId }) => {
  const isImage = text.substring(0, 8) == "https://";
  const [isLiked, setIsLiked] = useState(false);
  const [liker, setLiker] = useState(null);
  //get whether the message is liked
  useEffect(() =>{
    const getLiked = async () =>{
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/getLiked`,
        { messageId: messageId },
        { withCredentials: true },
      );
      if (!res.data.success) {
        console.log("Error fetching liked status: " + res.data.errorMessage);
      }
      else if (res.data.isLiked){
        setIsLiked(true);
        setLiker(res.data.likerId);
      }
  }
  getLiked();
},[]);

  const handleClick = async () =>{
    if(isLiked && liker !== cookie.get("userId")){
      return;
      //cannot unlike/like a message that someone else liked.
      //and cannot like a message that has already been liked.
    }
    setLiker( cookie.get("userId"));
    const temp = !isLiked;
      setIsLiked(temp);
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/likeMessage`,
        { messageId: messageId, userId: cookie.get("userId"), isDislike: !temp },
        { withCredentials: true },
      );
      if (!res.data.success) {
        console.log("Error liking message: " + res.data.errorMessage);
      }
  }

  return (
    <div className={`message ${author}`} onClick={handleClick}>
      {isImage ? (
        <img className="msg-img" src={text} alt="" />
      ) : (
        <p className="msg-text">{text}</p>
      )}
      <p className="msg-time">{timeStamp}</p>
      {isLiked ? <img className="liked-img" src="/like_symbol.png" alt="this message is liked"/> : null}
    </div>
  );
};

export default MessageThread;
