import React, { useEffect } from 'react';
import '../index.scss';
import ImageUpload from '../components/imageUpload/ImageUpload';

const Home = () => {
	useEffect(() => {
        document.title = "Tutors.tech: Home";
      }, []);
	return (
		<div className='long-page'>
			<div className='background-container'><img src='../../images/campus.jpg' width="100%" alt='Tutors.tech logo' /></div>
			<h1 className='pageHeader'>Welcome to Tutors.tech at SFSU</h1>
		</div>
	);
};

export default Home;
