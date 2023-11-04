// Author: team lead
// Date: 9/3/2023
// Purpose: component that is deprecated

import React, { useEffect, useState } from "react";
import "../index.scss";
import { cookie } from "../App";
import { Link } from "react-router-dom";

function StudentView() {
  const [userName, setUserName] = useState(cookie.get("userName"));
  useEffect(() => {
    document.title = "Tutors.tech: Welcome Student";
    cookie.addChangeListener(() => {
      setUserName(cookie.get("userName"));
    });
    setUserName(cookie.get("userName"));
    if (cookie.get("isTutor") === "true") {
      <Link to="/TutorView"></Link>;
    }
  }, []);
  return (
    <div>
      <h1 className="pageHeader">Welcome Student {userName}</h1>
    </div>
  );
}

export default StudentView;
