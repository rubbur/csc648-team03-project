import React, { useEffect } from 'react';
import '../index.css';
import ImageList from '../components/ImageList'; 

function AboutUs() {
  useEffect(() => {
    document.title = "Tutors.tech";
  }, []);
  return (
    <div>
      <h1 className='header'>About Us</h1>
      <ImageList /> 
    </div>
  );
}

export default AboutUs;
