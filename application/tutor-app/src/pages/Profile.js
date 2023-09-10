import '../index.css';
import React, { useState, useEffect } from 'react';

function Profile({img,name,bio}) {
    const [fileContent, setFileContent] = useState('');
    useEffect(() => {
        document.title = name;
        fetch(bio)
      .then((response) => response.text())
      .then((data) => {
        setFileContent(data);
      })
      .catch((error) => {
        console.error('Error fetching file:', error);
      });
      }, [name,bio]);

      const updateName = name.endsWith('s') ? `${name}' Profile` : `${name}'s Profile`;
  return (
    <div>
      <h1 className='header'>{updateName}</h1>
      <div className='bio'><img src={img} alt={name} /></div>
      <p className='bio'>{fileContent}</p>
    </div>
  );
}

export default Profile;