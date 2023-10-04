import { cookie } from "../../App";
import "./userProfile.css";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import ImageUpload from "../imageUpload/ImageUpload";
import "./userProfile.css";
import TutorEdit from "./editPages/TutorEdit";
import PasswordEdit from "./editPages/PasswordEdit";
import NameEdit from "./editPages/NameEdit";

const UserProfile = () =>{
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [editPage, setEditPage] = useState("name");
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

    const handleBecomeStudent = async () =>{
        //change this user to a student
    }

    const handleDeleteAccount =  async () =>{
        //delete this user's account
    }

    return (
        <div className="profile-container">
           
            <div className="profile">
                <div className="img-holder">
                <h1 className="header">{`Hello, ${cookie.get("userName")}`}</h1>
                     <img className="user-image" src={userData.img_url}/>
                     <div className="danger-container">
                        <div className="danger-field">
                            <h2>Danger Field</h2>
                            <button onClick={handleDeleteAccount}>Delete Account</button>
                         </div>
                     </div>
                    
                </div>
                <div className="edit-box">
                        <div className="button-container">
                        <button className={`profile-edit-button ${editPage == "upload" ? "pressed" : ""}`}  onClick={() => {setEditPage("upload")}}>Upload Image</button>
                            <button className={`profile-edit-button ${editPage == "name" ? "pressed" : ""}`}  onClick={() => {setEditPage("name")}}>Update Username</button>
                            <button className={`profile-edit-button ${editPage == "password" ? "pressed" : ""}`}  onClick={() => {setEditPage("password")}}>Update Password</button>            
                        {(cookie.get("isTutor")) ?  <button className="profile-edit-button" onClick={handleBecomeStudent}>Become Student</button> :
                            <button className={`profile-edit-button ${editPage == "tutor" ? "pressed" : ""}`} onClick={() => {setEditPage("tutor")}}>Register as Tutor</button>
                            }
                            {cookie.get("isTutor") == true && <button className={`profile-edit-button ${editPage == "edit-tutor" ? "pressed" : ""}`}  onClick={() => {setEditPage("edit-tutor")}}>Edit Abilities</button>}
                        </div>
                       
                </div>
                <div className="editting-box">
                    {editPage == "tutor" && <TutorEdit isTutor={false}/>}
                    {editPage == "name" && <NameEdit/>}
                    {editPage == "password" && <PasswordEdit/>}
                    {editPage == "edit-tutor" && <TutorEdit isTutor={true}/>}
                    {editPage == "upload" && <ImageUpload/>}
                </div>
               
            </div>
        </div>
    );
}




export default UserProfile;