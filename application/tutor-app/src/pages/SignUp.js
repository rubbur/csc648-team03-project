import React, { useEffect } from 'react';
import '../index.css';

function SignUp() {
  useEffect(() => {
    document.title = "Tutors.tech";
  }, []);
  return <h1 className='header'>Sign Up</h1>;
}

export default SignUp;
