import React, { useEffect } from 'react';
import '../index.css';
import ImageUpload from '../components/imageUpload/ImageUpload';

const Home = () => {
	useEffect(() => {
        document.title = "Tutors.tech: Home";
      }, []);
	return (
		<div>
			<div className='logo'>
				<img src='../../images/logo.png' className='logo'></img>
			</div>
			<h1 className='pageHeader'>Welcome to Tutors.tech at SFSU</h1>
		</div>
	);
};

export default Home;
