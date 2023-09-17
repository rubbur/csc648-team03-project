import React, { useEffect, useState } from 'react';
import '../index.css';
import axios from "axios";
import {cookie} from "../App"
import  { Navigate } from 'react-router-dom'

function SignIn() {
  useEffect(() => {
    document.title = "Tutors.tech: Sign In";
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Remember Me:", rememberMe);

    // send email and password to backend
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`,{username:username,password:password});
    console.log(response.data);
    setUsername("");
    setPassword("");
    if (response.data.success){
      //user successfully registered
      cookie.set("isLoggedIn",true);
      cookie.set("userName",response.data.username);
      cookie.set("isTutor",response.data.isTutor);

      
      if(cookie.get("isTutor")){
        return <Navigate to='/TutorView'  />
      }
      else{
        return <Navigate to='/StudentView'  />  
      }
      

    }
  };

  return (
    <div>
      <h1 className='header'>Sign In</h1>
      <div className="form-set">
        <div className="form-group">
          <label htmlFor="username" className='no-select'>Username: </label>
          <input
            type="username"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className='no-select'>Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rememberMe" className='no-select'>
            Remember me: 
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
          </label>
        </div>
        <div className="center-button">
          <button type="submit" onClick={handleLogin}>Sign In</button>
        </div>
        <div className="center-button">
          <button type="submit">Forgot Password?</button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
