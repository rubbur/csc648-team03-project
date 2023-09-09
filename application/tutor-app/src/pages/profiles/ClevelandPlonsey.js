import '../../index.css';
import React, { useEffect } from 'react';

function ClevelandPlonsey() {
    useEffect(() => {
        document.title = "Cleveland Plonsey's Profile";
      }, []);
  return (
    <div>
      <h1 className='header'>Cleveland Plonsey's Profile</h1>
    </div>
  );
}

export default ClevelandPlonsey;