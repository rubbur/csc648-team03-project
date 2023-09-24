import React, { useEffect } from 'react';
import '../index.css';
import ImageUpload from '../components/imageUpload/ImageUpload';

const Home = () => {
	useEffect(() => {
        document.title = "Tutors.tech: Home";
      }, []);
	return (
		<div>
			<h1 className='header'>Welcome to Tutors.tech at SFSU</h1>
			<ImageUpload/>
		</div>
	);
};

export default Home;
