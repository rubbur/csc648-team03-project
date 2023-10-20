import "./conversation.scss";

const Conversation = ({ conversation }) => {
    // You can access the details from the conversation object
    const { key, name, postSubject } = conversation;

    return (
        <div className="Conversation">
            <p>{key}</p>
            <p>{name}</p>
            <p>{postSubject}</p>
        </div>
    );
};

export default Conversation;
