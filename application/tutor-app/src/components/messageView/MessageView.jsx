import "./messageView.scss"
import ConversationList from "./conversationList/ConversationList"
import MessageThread from "./messageThread/MessageThread"
const MessageView = () => {

    return (
        <div className="MessageView">
            <ConversationList />
            <MessageThread />
        </div>
    )

}
export default MessageView