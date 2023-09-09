import '../../index.css';
import React, { useEffect } from 'react';

function MichaelMathews() {
    useEffect(() => {
        document.title = "Michael Mathews's Profile";
      }, []);
  return (
    <div>
      <h1 className='header'>Michael Mathews' Profile</h1>
    </div>
  );
}

export default MichaelMathews;
