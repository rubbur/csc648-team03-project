//Author: Ava Albert
//Date: 10/20/2023
//purpose: Displays a conversation card that when clicked opens a list of messages in the conversation

import "./conversation.scss";

const Conversation = ({
  img_url,
  name,
  postSubject,
  setThread,
  threadId,
  date,
  setPerson,
  postId,
  setShowConvos,
}) => {
  let formattedDate = date.split(/[- :]/);
  formattedDate =
    formattedDate[1] +
    "/" +
    formattedDate[2].split("T")[0] +
    "/" +
    formattedDate[0];
  return (
    <div
      className="ConversationContainer"
      onClick={() => {
        setThread(threadId);
        setPerson({ name: name, imgUrl: img_url, postId: postId });
        setShowConvos(false);
      }}
    >
      <div className="Conversation">
        <div className="user-container">
          <img
            src={process.env.PUBLIC_URL + img_url}
            alt={name + "'s profile picture"}
          />
        </div>
        <p>
          <b>{name}</b>
        </p>
        <p>{"Subject: " + postSubject}</p>
        <p>{"Last message: " + formattedDate}</p>
      </div>
    </div>
  );
};

export default Conversation;
