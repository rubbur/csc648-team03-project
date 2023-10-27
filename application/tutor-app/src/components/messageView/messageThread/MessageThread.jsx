// Author: Ava Albright, Michael Mathews, Cleveland Plonsey
// Date: 10/18/2023
// Purpose: renders all messages in a conversation



import { useState } from "react"
import "./messageThread.scss"

const MessageThread = ({msgs }) => {

    const [messageList, setMessageList] = useState(msgs || [])

    return (

        <div className="MessageThread">
            <h1>Message Threads</h1>
            {
                messageList.map( msg => <p>{msg.message_text}</p>)
            }
        </div>


    )

}

export default MessageThread;