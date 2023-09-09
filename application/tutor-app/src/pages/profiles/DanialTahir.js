import '../../index.css';
import React, { useEffect } from 'react';

function DanialTahir() {
    useEffect(() => {
        document.title = "Danial Tahir's Profile";
      }, []);
  return (
    <div>
      <h1 className='header'>Danial Tahir's Profile</h1>
    </div>
  );
}

export default DanialTahir;