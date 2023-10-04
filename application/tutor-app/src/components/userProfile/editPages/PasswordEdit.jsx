import "./editPage.css";
import axios from "axios";
import {useState} from "react";
import { cookie } from "../../../App";
import Mascot from "../../mascot/mascot";

const  PasswordEdit = () =>{
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const handlePasswordChange = async () =>{
        if(password !== confirmPassword){
            alert("passwords do not match!");
            return;
        }
        const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/editPassword`,
         {
            username: cookie.get("userName"),
             newPassword: password,
             password: currentPassword
        }, {withCredentials: true});
       
        if(!result.data.success){
            console.log(result.data.errorMessage);
            alert("Could not update password. Try again later.");
        }
        setPassword("");
        setConfirmPassword("");
    }

    return (
        <div className="password-edit edit-form">
            <h2>Editting Password...</h2>
            Enter Current Password: <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}/> 
New Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
Confirm Password: <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>  
<button className="submit-edit-button" onClick={handlePasswordChange}>update password</button>       
        </div>
    );
}

export default PasswordEdit;