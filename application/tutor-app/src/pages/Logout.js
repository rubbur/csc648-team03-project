import {cookie} from "../App"
import  { useNavigate } from 'react-router-dom'
import {useEffect} from 'react';

function Logout() {
    const navigate = useNavigate();
    useEffect(() => {
      cookie.remove("isLoggedIn");
      cookie.remove("isTutor");
      cookie.remove("userName");
      navigate("/");
      navigate(0);
    }, []);
    return (
      <div>
        <h1 className='header'>Logout</h1>
      </div>
    );
  }

  export default Logout;