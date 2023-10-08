import React, { useEffect, useState } from 'react';
import '../index.css';
import ImageList from '../components/ImageList'; 
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