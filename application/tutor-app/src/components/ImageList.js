import React from 'react';

const ImageWithHeader = ({ imagePath, headerText }) => {
  return (
    <div className="image-container">
      <img src={imagePath} alt="Profile Pic" />
      <h2>{headerText}</h2>
    </div>
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
    <div>
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
