import React from 'react';
import '../index.css';

const ImageWithHeader = ({ imagePath, headerText }) => {
  const pageUrl = `./profiles/${headerText.replace(' ', '')}`;

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
  };

  const containerStyle = {
    position: 'relative',
    width: '100%', 
    maxWidth: '256px', 
    height: '100%',
    maxHeight: '256px', 
    overflow: 'hidden',
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const headerStyle = {
    fontSize: '1.4rem', 
  };

  return (
    <a href={pageUrl} target="_blank" className="image-list-item about-color" rel="noreferrer" style={linkStyle}>
      <div className="image-column" style={containerStyle}>
        <img src={imagePath} style={imgStyle} alt="Profile Pic" />
      </div>
      <div className="header-column">
        <h2 style={headerStyle}>{headerText}</h2>
      </div>
    </a>
  );
};

const ImageList = () => {
  const images = [
    { imagePath: '../../images/Ava_Albert.png', headerText: 'Ava Albert' },
    { imagePath: '../../images/Griffin_Evans.jpg', headerText: 'Griffin Evans' },
    { imagePath: '../../images/Bryan_Maldonado.jpg', headerText: 'Bryan Maldonado' },
    { imagePath: '../../images/Cleveland_Plonsey.png', headerText: 'Cleveland Plonsey' },
    { imagePath: '../../images/Danial_Tahir.jpg', headerText: 'Danial Tahir' },
    { imagePath: '../../images/Michael_Mathews.jpg', headerText: 'Michael Mathews' },
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
