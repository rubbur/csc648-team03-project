import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./notifications.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { cookie } from "../../App";

const Notifications = () =>{

    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    useEffect(() =>{
        const getNotifications = async () =>{
            try {
                const res =  await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getNotifications`, {userId: cookie.get("userId")}, {withCredentials: true});
                if (!res.data.success) {
                    console.log("Error fetching notifications: " + res.data.errorMessage);
                }
                else {
                    setNotifications(res.data.notifications);
                }
            } catch (err) {
                console.log("Error fetching notifications: " + err);
            }
        }

        getNotifications();

    }, [])


    const handleNotificationClick = async (notification) => {
      // Handle the click on a notification, e.g., mark it as read
      let notificationName = notification.name;
      let notificationId = notification.id;
      const type = notification.type; //messages or reviews
      const route = "/Profile";

      //update the database
      const deleteResult = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/deleteNotification`, {notificationId: notificationId}, {withCredentials: true});
        if (!deleteResult.data.success) {
            console.log("Error deleting notification: " + deleteResult.data.errorMessage);
        }
        const newNotifications = notifications.filter( (noti) => noti.name !== notificationName);
        setNotifications([...newNotifications]);
        navigate(route, {state: {type: type}})
    };
  
    return (
      <div className="notifications-box">
        <div className="dropdown">
          <button
            className="dropdown-toggle"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <FontAwesomeIcon icon={"fa-regular fa-bell"} />
            {(notifications.length > 0) && <p id="num-notifications">{notifications.length}</p>}
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {notifications.length === 0 ? (
                <div className="dropdown-item" onClick={() => {}} disabled>
                  No notifications
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <p
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {notification.name}
                  </p>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  };



export default Notifications;




