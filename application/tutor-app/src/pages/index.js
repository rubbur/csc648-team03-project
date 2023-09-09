import React, { useEffect } from 'react';
import '../index.css';

const Home = () => {
	useEffect(() => {
        document.title = "Tutors.tech";
      }, []);
	return (
		<div>
			<h1 className='header'>Welcome to Tutors.tech</h1>
		</div>
	);
};

export default Home;
