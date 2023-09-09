import '../../index.css';
import React, { useEffect } from 'react';

function GriffinEvans() {
    useEffect(() => {
        document.title = "Griffin Evans's Profile";
      }, []);
  return (
    <div>
      <h1 className='header'>Griffin Evans' Profile</h1>
    </div>
  );
}

export default GriffinEvans;