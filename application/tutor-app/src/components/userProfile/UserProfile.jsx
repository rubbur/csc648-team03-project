import { cookie } from "../../App";
import "./userProfile.css";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import ImageUpload from "../imageUpload/ImageUpload";

const UserProfile = () =>{
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});

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
            }
        }
        loadUserData();
    }, []);

    return (

        <div className="profile">
           <h1>{`Hello, ${cookie.get("userName")}`}</h1>
            <img className="user-image" src={userData.img_url}/>
           <div className="edit-box">
            <ImageUpload/>
           </div>
        </div>
    );
}

export default UserProfile;