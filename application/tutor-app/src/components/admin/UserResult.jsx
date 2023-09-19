//Author: Cleveland Plonsey
//UserResult is a component that represents a user in the MySQL database.
//The component provides buttons that allow the admin to either delete a user
//or an edit button which opens a dialogue box wherein the admin can edit whatever columns they please on that particular row
import axios from "axios";
import { useState } from "react";
import "./admin.css";
import Modal from 'react-modal';


const UserResult = ({username, userId, isTutor, imgUrl }) =>{
    const [isVisible, setIsVisible] = useState(true);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [newUsername, setUsername] = useState(username);
    const [newPassword, setPassword] = useState(undefined);
    const [newIsTutor, setIsTutor] = useState(isTutor);
    const [newImgUrl, setImgUrl] = useState(imgUrl);
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
        setIsOpen(true);
    }

    const handleApplyChanges = async () =>{
        //TODO: should pass all fields from the modal to the second argument. Also need to create the route in the backend
        const res =  await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/EditUser`, {
            userId: userId,
            newUsername: newUsername,
            oldUsername: username,
            newPassword: newPassword,
            newImgUrl: newImgUrl,
            newIsTutor: newIsTutor
            }, {withCredentials: true});
            if(res.data.success){
                setIsOpen(false);
                alert("Succesfully Edited user: " + username);
            }
    }

    return (
        
        <div className = {` ${isVisible ? "" : "hidden"} user-result `}>
        {    
           isVisible &&
            <div>
                <p>{username}</p>
                <button className="user-delete-button" onClick={handleDelete}>X</button>
                <button className="user-edit-button" onClick={handleEdit}>Edit</button>
            </div>
        }
        
      {/*--------------------------------------Modal---------------------------------------------------------------------------------- */}
        <Modal
        className="custom-modal"
        isOpen={modalIsOpen}
        onRequestClose={() =>setIsOpen(false)}
        >
        <h2>Edit Mode</h2>
        <button className = "close-modal-button" onClick={() =>setIsOpen(false)}>X</button>
        <div className="edit-options">
            New Username: <input type="text" value={newUsername} onChange={ e => setUsername(e.target.value)} />
            Tutor: <input type="checkbox" checked={newIsTutor} onChange={() =>setIsTutor(!newIsTutor)}/>
            {/* //if this field is left undefined then no password update will be applied */}
            New Password: <input type="password" value={undefined} onChange={ e => setPassword(e.target.value)}/> 
            New image Url: <input type="text" value={newImgUrl} onChange={ e => setImgUrl(e.target.value)}/>
        </div>
        <button className="apply-changes-button" onClick={handleApplyChanges}>Apply Changes</button>
        </Modal> 
    </div> 
    );
}

export default UserResult;