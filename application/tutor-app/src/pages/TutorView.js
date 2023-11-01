// Author: team lead
// Date: 9/3/2023
// Purpose: component that is deprecated

import React, { useEffect, useState } from 'react';
import '../index.scss';
import {cookie} from "../App"

function TutorView() {
  useEffect(() => {
    document.title = "Tutors.tech: Welcome Tutor";
  }, []);

  const [userName, setUserName] = useState(cookie.get("userName"));
  useEffect(() => {
    cookie.addChangeListener(() => {
      setUserName(cookie.get("userName"));
    });
    setUserName(cookie.get("userName"));
  }, []);
  return (
    <div>
      <h1 className='pageHeader'>Welcome Tutor {userName}</h1>
      
    </div>
  );
}

export default TutorView;