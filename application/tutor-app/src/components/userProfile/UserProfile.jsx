import { cookie } from "../../App";
import "./userProfile.scss";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import ImageUpload from "../imageUpload/ImageUpload";
import TutorEdit from "./editPages/TutorEdit";
import PasswordEdit from "./editPages/PasswordEdit";
import NameEdit from "./editPages/NameEdit";

const UserProfile = () =>{
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [editPage, setEditPage] = useState("name");
    const [userName, setUserName] = useState(cookie.get("userName"));
    useEffect(() => {
      cookie.addChangeListener(() => {
        setUserName(cookie.get("userName"));
      });
      setUserName(cookie.get("userName"));
    }, []);
        useEffect(() =>{
            console.log("in the use effect");
            const loadUserData = async () =>{
            //get the user data from the database
           
            const data = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getUserData`, {username: cookie.get("userName")}, {withCredentials: true});
            if(!data.data.success){
                console.log(data.data.errorMessage);
               // navigate("/");
            }
            else{
                console.log(data.data.userData);
                setUserData({...data.data.userData[0]});
                console.log(JSON.stringify(data.data.userData[0]));
            }
        }
        loadUserData();
    }, []);

    const handleCreatePost = async () =>{
        //navigate to the create post page
        navigate("/CreatePost");
    }

    const handleDeleteAccount =  async () =>{
        const confirmation = window.confirm("Are you sure you want to delete your account?");
        if(confirmation){
            // user clicked ok
            //delete this user's account
            const data = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/deleteAccount`, {username: cookie.get("userName")}, {withCredentials: true});
            if(data.data.success){
                await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/Logout`, {}, {withCredentials: true});
                navigate("/Logout");
            }
        } else {
            // user clicked cancel
        }
    }

    return (
        <div className="profile-container">
            <div className="profile">
                <div className="img-holder">
                <h1 className="header">{`${userName}`}</h1>
                     <img className="user-image" src={userData.img_url} alt={userName+"'s profile picture."}/>
                </div>
                <div className="edit-container">
                <div className="edit-box">
                        <div className="button-container">
                            <button className={`profile-edit-button ${editPage === "upload" ? "pressed" : ""}`}  onClick={() => {setEditPage("upload")}}>Upload Image</button>
                            <button className={`profile-edit-button ${editPage === "name" ? "pressed" : ""}`}  onClick={() => {setEditPage("name")}}>Update Username</button>
                            <button className={`profile-edit-button ${editPage === "password" ? "pressed" : ""}`}  onClick={() => {setEditPage("password")}}>Update Password</button>            
                            {!(cookie.get("isTutor")) && <button className={`profile-edit-button ${editPage === "tutor" ? "pressed" : ""}`} onClick={() => {setEditPage("tutor")}}>Register as Tutor</button>}
                            {(cookie.get("isTutor")) && <button className={`profile-edit-button post-button`} onClick={handleCreatePost}>Create Post</button>}
                        </div>
                       
                </div>
                <div className="editting-box">
                    {editPage === "tutor" && <TutorEdit isTutor={false}/>}
                    {editPage === "name" && <NameEdit/>}
                    {editPage === "password" && <PasswordEdit/>}
                    {editPage === "edit-tutor" && <TutorEdit isTutor={true}/>}
                    {editPage === "upload" && <ImageUpload/>}
                </div>
                </div>
            </div>
            <div className="danger-container">
                        <div className="danger-field">
                            <h2>Danger Field</h2>
                            <button onClick={handleDeleteAccount} className='danger-button'>Delete Account</button>
                         </div>
                     </div>
        </div>
    );
}




export default UserProfile;