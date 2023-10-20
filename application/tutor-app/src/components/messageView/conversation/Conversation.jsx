import "./conversation.scss"

const Conversation = ({name, postSubject}) =>  {

    return (
        <div className="Conversation">
            <p>
            {
                name
            }
            </p>

            <p>
            {
                postSubject
            }
            </p>


        </div>


    )


}
export default Conversation