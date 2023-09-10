import React, { useEffect, useState } from 'react';
import '../index.css';
import axios from "axios";

function SignUp() {
  useEffect(() => {
    document.title = "Tutors.tech: Sign Up";
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async () => {
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember Me:", rememberMe);
    
    // send email and password to backend
    const response = await axios.post(process.env.REACT_APP_BACKEND_URL,{email:email,password:password});
    console.log(response.data);
  };

  return (
    <div>
      <h1 className='header'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='form-color'>
        <div className="form-group">
          <label htmlFor="email" className='no-select'>Email: </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
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
          <button onClick={handleSubmit}>Sign Up</button>
        </div>
        <div className="center-button">
          <button type="submit">Forgot Password?</button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
