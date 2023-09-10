import '../index.css';
import React, { useEffect } from 'react';

function Profile({img,name,bio}) {
    useEffect(() => {
        document.title = name;
      }, [name]);
  return (
    <div>
      <h1 className='header'>{name}'s Profile</h1>
      <p className='bio'>{bio}</p>
      <img src={img} alt={name}/>
    </div>
  );
}

export default Profile;