import '../index.css';
import React from 'react';

function Profile({ img, name, bio }) {
  const updateName = name.endsWith('s') ? `${name}' Profile` : `${name}'s Profile`;

  return (
    <div>
      <h1 className='header'>{updateName}</h1>
      <div className='bio'><img className="profile-image" src={img} alt={name} width={256} height={256} /></div>
      <p className='bio'>{bio}</p>
    </div>
  );
}

export default Profile;
