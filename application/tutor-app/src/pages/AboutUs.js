import React, { useEffect } from 'react';
import '../index.css';
import ImageList from '../components/ImageList'; 

function AboutUs() {
  useEffect(() => {
    document.title = "Tutors.tech: About Us";
  }, []);
  return (
    <div>
      <h1 className='header'>About Us</h1>
      <h1 classname='header'>Software Engineering 648 Team 3</h1>
      <ImageList /> 
    </div>
  );
}

export default AboutUs;
