import '../../index.css';
import React, { useEffect } from 'react';

function BryanMaldonado() {
    useEffect(() => {
        document.title = "Bryan Maldonado's Profile";
      }, []);
  return (
    <div>
      <h1 className='header'>Bryan Maldonado's Profile</h1>
    </div>
  );
}

export default BryanMaldonado;