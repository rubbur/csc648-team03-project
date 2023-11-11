// Author:  Whole team
// Date: 8/26/2023
// Purpose: Landing page for the application. Contains a few tutors and the ability to log in or register

import React, { useState, useEffect, useRef } from "react";
import "../index.scss";
import { UserResult } from "../components/searchResults/SearchResults";
import axios from "axios";
import { Fade } from "react-awesome-reveal";
const Home = () => {
  const backgroundContainerRef = useRef(); // Create a ref object
  const [topThreeTutors, setTopThreeTutors] = useState([]);
  //get the top three tutors of the site
  useEffect(() => {
    const getTopTutors = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/tutor/topThreeTutors`,
        {},
        { withCredentials: true },
      );
      if (response.data.success) {
        setTopThreeTutors([...response.data.data]);
      }
    };
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

    window.addEventListener("scroll", updateBackgroundPosition);
    return () => {
      window.removeEventListener("scroll", updateBackgroundPosition);
    };
  }, []);

  return (
    <div>
      {/* here lies my moving image */}
      {/*<div className='background-container' ref={backgroundContainerRef}></div>*/}

      <h1 className="pageHeader">Welcome to Tutors.tech at SFSU</h1>
      <h2 className="recent-posts-text">Our three most recent posts</h2>
      <hr></hr>
      <br></br>
      <br></br>
      <div className="top-tutors-container">
        <div>
          {topThreeTutors.length > 0 &&
            topThreeTutors.map((tutor, index) => (
              <Fade key={index}>
                <UserResult
                  name={tutor.name}
                  postId={tutor.post_id}
                  imgUrl={tutor.img_url}
                  avgRating={
                    tutor.avg_rating !== undefined
                      ? tutor.avg_rating.toFixed(1)
                      : "0.0"
                  }
                  subject={tutor.subject}
                  rate={"$" + tutor.hourly_rate + "/hr"}
                  tutorId={tutor.tutor_id}
                />
              </Fade>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
