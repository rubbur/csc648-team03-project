import { cookie } from "../App"
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
//import axios from "axios";
function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    const logout = async () => {
      //const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/logout`, {withCredentials: true});
      cookie.remove("isLoggedIn");
      cookie.remove("isTutor");
      cookie.remove("userName");

      // Remove any unsent message item from local storage
      localStorage.removeItem("unsentMessage");
      localStorage.removeItem("unsentMessageRecipientId");
      localStorage.removeItem("unsentMessagePostId");

      navigate("/");
      navigate(0);
    }
    logout();
  }, [navigate]);
  return (
    <div>
      {/*<h1 className='pageHeader'>Logout</h1>--->*/}
    </div>
  );
}

export default Logout;