import "./conversationList.scss"
import { useState } from "react"
import Conversation from "../conversation/Conversation"
const ConversationList = () => {

const [convoList, setConvoList] = useState([{name: "Cleveland", postSubject: "Computer Science"},
{name: "Michael", postSubject: "Everything"},
{name: "Ava", postSubject: "Rocket Science"}])

return (<div className= "ConversationList"> 

<h1>Conversations</h1>
{
    convoList.map((convo)=> {

        return < Conversation name= {convo.name} postSubject={convo.postSubject}/ >

    })
}

</div>)




}
export default ConversationList