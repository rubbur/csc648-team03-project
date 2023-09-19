//Author: Cleveland Plonsey
//UserResult is a component that represents a user in the MySQL database.
//The component provides buttons that allow the admin to either delete a user
//or an edit button which opens a dialogue box wherein the admin can edit whatever columns they please on that particular row
import axios from "axios";
import { useState } from "react";

const UserResult = ({username, userId}) =>{
    const [isVisible, setIsVisible] = useState(true);

    const handleDelete = async () =>{
        //delete the user by their username
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/deleteUser`, {userId: userId}, {withCredentials: true});
        if(res.data.success){
            alert(`user: ${username} successfully deleted.`);
            setIsVisible(false);
            //TODO: rerender the userList without the newly deleted user result
            //could either set this component to display: none or pass a refresh function from the Admin parent component and call it
        }
    }

    const handleEdit = () =>{
        //TODO: install react-modal, setup the react modal with all the fields that should be editable, add the apply changes button to modal
        //open up the modal
    }

    const handleApplyChanges = async () =>{
        //TODO: should pass all fields from the modal to the second argument. Also need to create the route in the backend
        const res =  await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/EditUser`, {userId: userId}, {withCredentials: true});
    }

    return (
        
        <div className = "user-result">
        {    
           isVisible &&
            <div>
                <p>{username}</p>
                <button onClick={handleDelete}>X</button>
                <button onClick={handleEdit}>Edit</button>
            </div>
        }
        </div>
        
    )
}

export default UserResult;