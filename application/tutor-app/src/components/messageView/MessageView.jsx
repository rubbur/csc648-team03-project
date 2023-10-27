// Author: Ava Albright, Michael Mathews, Cleveland Plonsey
// Date: 10/18/2023
// Purpose: renders all conversations that a user has as conversation cards on the left.
//on the right of the view, the current conversation that the user has selected.


import "./messageView.scss"
import ConversationList from "./conversationList/ConversationList"
import MessageThread from "./messageThread/MessageThread"
import React, {useEffect, useState} from "react";
import axios from "axios";


const MessageView = () => {
    const [thread, setThread] = useState([]);
    const [convoMap, setConvoMap] = useState(new Map());
    useEffect(() => {
        //get all the conversations
        const  getConvoMap = async () => {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getConversations`,
             { withCredentials: true });
             setConvoMap(res.data.conversations);
        }   
    }, [])


    return (
        <div className="MessageView">
            <ConversationList setThread={setThread}/>
            <MessageThread msgs={convoMap.get(thread)}/>
        </div>
    )

}
export default MessageView