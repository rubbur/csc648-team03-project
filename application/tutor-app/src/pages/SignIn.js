import React, { useEffect } from 'react';
import '../index.css';

function SignIn() {
  useEffect(() => {
    document.title = "Tutors.tech: Sign In";
  }, []);
  return <h1 className='header'>Sign In</h1>;

  
}

export default SignIn;