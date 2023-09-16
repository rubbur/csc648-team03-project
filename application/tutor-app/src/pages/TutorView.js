import React, { useEffect } from 'react';
import '../index.css';
import ImageList from '../components/ImageList'; 
import {cookie} from "../App"

function TutorView() {
  useEffect(() => {
    document.title = "Tutors.tech: Welcome Tutor";
  }, []);
  return (
    <div>
      <h1 className='header'>Welcome Tutor {cookie.get("userName")}</h1>
      
    </div>
  );
}

export default TutorView;