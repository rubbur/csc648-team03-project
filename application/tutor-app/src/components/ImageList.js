import React from 'react';
import '../index.css';

const ImageWithHeader = ({ imagePath, headerText }) => {
  const pageUrl = `./profiles/${headerText.replace(' ', '')}`;

  const linkStyle = {
    color: 'white', 
    textDecoration: 'none', 
  };

  const imgStyle = {
    width:"256px",
    height:"256px",
  };

  return (
    <a href={pageUrl} target="_blank" className="image-list-item about-color" rel="noreferrer" style={linkStyle}>
      <div className="image-column">
        <img src={imagePath} style={imgStyle} alt="Profile Pic" />
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
    { imagePath: '../../images/Griffin_Evans.jpg', headerText: 'Griffin Evans' },
    { imagePath: '../../images/Bryan_Maldonado.jpg', headerText: 'Bryan Maldonado' },
    { imagePath: '../../images/Cleveland_Plonsey.png', headerText: 'Cleveland Plonsey' },
    { imagePath: '../../images/Danial_Tahir.jpg', headerText: 'Danial Tahir' },
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
