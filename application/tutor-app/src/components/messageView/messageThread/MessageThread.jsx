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