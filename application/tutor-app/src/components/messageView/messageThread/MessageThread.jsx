// Author: Ava Albright, Michael Mathews, Cleveland Plonsey
// Date: 10/18/2023
// Purpose: renders all messages in a conversation


import "./messageThread.scss"

const MessageThread = ({ msgs }) => {
    let reversedMsgs = msgs ? [...msgs].reverse() : [];

    return (
        <div className="MessageThread">
            <h1>Message Threads</h1>
            {
                msgs && reversedMsgs.map(msg => <p>{msg.message_text}</p>)
            }
        </div>
    )
}

export default MessageThread;