import React, { useEffect } from 'react';
import '../index.scss';
import ImageUpload from '../components/imageUpload/ImageUpload';

const Home = () => {
	useEffect(() => {
        document.title = "Tutors.tech: Home";
      }, []);
	return (
		<div>
			<img src='../../images/campus.jpg' width="100%" alt='Tutors.tech logo' />
			<h1 className='pageHeader'>Welcome to Tutors.tech at SFSU</h1>
		</div>
	);
};

export default Home;
