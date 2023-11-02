// Author: Michael Mathews, Cleveland Plonsey
// Date: 9/18/2023
// Purpose: this component is rendered when the user logs out. It does not have any jsx.
//cleans up cookies and session for user.
//shouldnt be a component at all.

import { cookie } from "../App";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    const logout = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/user/Logout`,
        { withCredentials: true },
      );
      // Remove any unsent message item from local storage
      localStorage.removeItem("unsentMessage");
      localStorage.removeItem("unsentMessageRecipientId");
      localStorage.removeItem("unsentMessagePostId");
      localStorage.removeItem("temporaryWindow");

      navigate("/");
    };
    logout();
  }, [navigate]);
  return null;
}

export default Logout;
