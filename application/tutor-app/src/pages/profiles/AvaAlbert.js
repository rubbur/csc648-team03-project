import '../../index.css';
import React, { useEffect } from 'react';

function AvaAlbert() {
    useEffect(() => {
        document.title = "Ava Albert's Profile";
      }, []);
  return (
    <div>
      <h1 className='header'>Ava Albert's Profile</h1>
    </div>
  );
}

export default AvaAlbert;