// Author:  Michael Mathews
// Date: 8/29/2023
// Purpose: component that displays a developer of the project with their image and a short bio about them


import React from 'react';
import '../index.scss';

function Profile({ img, name, bio }) {
  const updateName = name.endsWith('s') ? `${name}' Profile` : `${name}'s Profile`;

  return (
    <div>
      <h1 className='pageHeader'>{updateName}</h1>
      <div className='image-container bio'>
        <img
          src={img}
          alt={name}
          className='profile-image'
        />
      </div>
      <p className='bio'>{bio}</p>
    </div>
  );
}

export default Profile;
