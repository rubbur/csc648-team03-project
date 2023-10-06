import React, { useEffect } from 'react';
import '../index.css';
import ImageList from '../components/ImageList'; 
import {cookie} from "../App"

function StudentView() {
  useEffect(() => {
    document.title = "Tutors.tech: Welcome Student";
  }, []);
  return (
    <div>
      <h1 className='pageHeader'>Welcome Student {cookie.get("userName")}</h1>
      
    </div>
  );
}

export default StudentView;