// Author:  Cleveland Plonsey
// Date: 10/18/2023
// Purpose: presents user with form that allows user to change their username

import { useState } from "react";
import "./editPage.scss";
import { cookie } from "../../../App";
import axios from "axios";

const NameEdit = () => {
  const [username, setUsername] = useState("");

  const handleNameChange = async () => {
    if (!username.endsWith("@sfsu.edu") || username.length < 10) {
      alert("Please use a SFSU email address. Example email: example@sfsu.edu");
      return;
    }
    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/user/editUsername`,
      {
        username: cookie.get("userName"),
        newUserName: username,
      },
      { withCredentials: true },
    );
    if (result.data.success) {
      cookie.set("userName", username);
      setUsername("");
    } else {
      console.log(result.data.errorMessage);
      alert("This email address is already in use");
    }
  };
  return (
    <div className="name-edit edit-form">
      <h2>Editting Username...</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button className="submit-edit-button" onClick={handleNameChange}>
        Update Username
      </button>
    </div>
  );
};

export default NameEdit;
