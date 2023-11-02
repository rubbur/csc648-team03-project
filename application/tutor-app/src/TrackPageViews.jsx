import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

const TrackPageViews = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

    // Track initial pageview
    ReactGA.pageview(location.pathname + location.search);
    //custom component test
    ReactGA.pageview('/Messages');
    ReactGA.pageview('/tutorProfile');


    // Set up listener for route changes
    const unlisten = () => {
      ReactGA.pageview(location.pathname + location.search);
    };

    return unlisten;
  }, [location]);

  return null;
};

export default TrackPageViews;

  