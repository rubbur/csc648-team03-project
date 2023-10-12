import React, { useEffect, useRef } from 'react';
import '../index.scss';

const Home = () => {
    const backgroundContainerRef = useRef(); // Create a ref object

    useEffect(() => {
        document.title = "Tutors.tech: Home";

        // moves the image in the background as the user scrolls
        const updateBackgroundPosition = () => {
            const scrollY = window.scrollY || window.pageYOffset;
            const backgroundContainer = backgroundContainerRef.current;
            if (backgroundContainer) {
                const newPosition = `${-scrollY*0.5}px -280px`; 
                backgroundContainer.style.backgroundPosition = newPosition; 
            }
        };

        window.addEventListener('scroll', updateBackgroundPosition); 
        return () => {
            window.removeEventListener('scroll', updateBackgroundPosition); 
        };
    }, []);

    return (
        <div className='long-page'>
            <div className='background-container' ref={backgroundContainerRef}></div>
            <h1 className='pageHeader'>Welcome to Tutors.tech at SFSU</h1>
        </div>
    );
};

export default Home;
