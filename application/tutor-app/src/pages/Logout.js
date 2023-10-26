import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import axios from "axios";

function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    const logout = async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/Logout`, { withCredentials: true });

      // Remove any unsent message item from local storage
      localStorage.removeItem("unsentMessage");
      localStorage.removeItem("unsentMessageRecipientId");
      localStorage.removeItem("unsentMessagePostId");

      navigate("/");
    }
    logout();
  }, [navigate]);
  return null;
}

export default Logout;