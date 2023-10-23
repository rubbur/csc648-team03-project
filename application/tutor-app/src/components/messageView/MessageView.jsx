import "./messageView.scss"
import ConversationList from "./conversationList/ConversationList"
import MessageThread from "./messageThread/MessageThread"
import React, {useState} from "react";



const MessageView = () => {
    const [thread, setThread] = useState([]);
   
    return (
        <div className="MessageView">
            <ConversationList setThread={setThread}/>
            <MessageThread msgs={thread}/>
        </div>
    )

}
export default MessageView