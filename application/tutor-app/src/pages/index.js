import React, { useState, useEffect, useRef } from 'react';
import '../index.scss';
import { UserResult } from '../components/searchResults/SearchResults';
import axios from 'axios';

const Home = () => {
    const backgroundContainerRef = useRef(); // Create a ref object
    const [topThreeTutors, setTopThreeTutors] = useState([]);
    //get the top three tutors of the site
    useEffect( () => {
        const getTopTutors = async () => {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tutor/topThreeTutors`, {}, {withCredentails: true});
            console.log("this is the response: " +response.data)
            if(response.data.success) {
                setTopThreeTutors([...response.data.data]);
                console.log(JSON.stringify(response.data.data));
            }

        }
        getTopTutors();
    }, []);


    useEffect(() => {
        document.title = "Tutors.tech: Home";

        // moves the image in the background as the user scrolls
        const updateBackgroundPosition = () => {
            const scrollY = window.scrollY || window.pageYOffset;
            const backgroundContainer = backgroundContainerRef.current;
            if (backgroundContainer) {
                const newPosition = `${-scrollY * 0.5}px -280px`;
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
            {/* here lies my moving image */}
            {/*<div className='background-container' ref={backgroundContainerRef}></div>*/}

            <h1 className='pageHeader'>Welcome to Tutors.tech at SFSU</h1>
            <h2>Our three most recent posts</h2>
            <hr></hr>
            <br></br>
            <br></br>
            <div className='top-tutors-container'>
            {
                topThreeTutors.length > 0 &&
                topThreeTutors.map( tutor => <UserResult 
                    name={tutor.name}
                    postId={tutor.post_id}
                    imgUrl={tutor.img_url}
                    subject={tutor.subject}
                    rate={tutor.hourly_rate}
                    tutorId={tutor.tutor_id}
                />)
            }
            </div>
        </div>
    );
};

export default Home;
