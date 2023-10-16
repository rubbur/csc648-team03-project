import React, { useEffect, useState } from 'react';
import '../index.scss';
import axios from "axios";
import {cookie} from "../App"
import  { Link, useNavigate } from 'react-router-dom'

function SignUp() {
  useEffect(() => {
    document.title = "Tutors.tech: Sign Up";
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleacceptTermsChange = (e) => {
    setAcceptTerms(e.target.checked);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const navigate = useNavigate();

  const HandleRegistration = async () => {
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Remember Me:", rememberMe);
    console.log("Accept Terms:", acceptTerms);

    if(!acceptTerms){
      alert("Please accept the terms of service");
      // don't send request to backend if terms not accepted
      return;
    }
    
    // send email and password to backend
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/register`,
    {username:username,password:password},
     {withCredentials: true}
     );
    console.log(response.data);
    setUsername("");
    setPassword("");
    if (response.data.success){
      //user successfully registered
      cookie.set("isLoggedIn",true);
      cookie.set("userName",response.data.username);
      cookie.set("userId", response.data.userId);

      console.log(cookie.get("userName"));
      console.log(cookie.get("isLoggedIn"));
    }

  };

  return (
    <div>
      <h1 className='pageHeader'>Sign Up</h1>
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
        <div className="form-group no-select">
          <label htmlFor="acceptTerms" >
            <div>
              <span className='accept-text'>Accept </span>
              <Link className='terms-link'>Terms of Service</Link>:
            

            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={acceptTerms}
              onChange={handleacceptTermsChange}
            />
            </div>
          </label>
        </div>
        <div className="center-button">
          <button onClick={HandleRegistration}>Sign Up</button>
        </div>
        

      </div>
    </div>
  );
}

export default SignUp;
