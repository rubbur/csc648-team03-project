import React from 'react';
import '../index.css';

const ImageWithHeader = ({ imagePath, headerText }) => {
  const pageUrl = `./pages/profiles/${headerText.replace(' ', '')}`;

  const linkStyle = {
    color: 'white', 
    textDecoration: 'none', 
  };

  return (
    <a href={pageUrl} target="_blank" className="image-list-item about-color" rel="noreferrer" style={linkStyle}>
      <div className="image-column">
        <img src={imagePath} alt="Profile Pic" />
      </div>
      <div className="header-column">
        <h2>{headerText}</h2>
      </div>
    </a>
  );
};

const ImageList = () => {
  const images = [
    { imagePath: '../../images/favicon.png', headerText: 'Ava Albert' },
    { imagePath: '../../images/favicon.png', headerText: 'Griffin Evans' },
    { imagePath: '../../images/favicon.png', headerText: 'Bryan Maldonado' },
    { imagePath: '../../images/favicon.png', headerText: 'Cleveland Plonsey' },
    { imagePath: '../../images/favicon.png', headerText: 'Danial Tahir' },
    { imagePath: '../../images/favicon.png', headerText: 'Michael Mathews' },
  ];

  return (
    <div className="image-list-container">
      {images.map((image, index) => (
        <ImageWithHeader
          key={index}
          imagePath={image.imagePath}
          headerText={image.headerText}
        />
      ))}
    </div>
  );
};

export default ImageList;
