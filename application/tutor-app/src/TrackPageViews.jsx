//google analytics
import ReactGA from 'react-ga';
import React, {useEffect} from "react";
import { useNavigate } from 'react-router-dom';

const TrackPageViews = () => {
    const navigate = useNavigate();
    useEffect(() => {
      ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);
  
      // Track initial pageview
      ReactGA.pageview(window.location.pathname + window.location.search);
  
      // Set up listener for route changes
      const unlisten = navigate((location) => {
        ReactGA.pageview(location.pathname + location.search);
      });
  
    }, [navigate]);
  
    return null;
  };

  export default TrackPageViews;
  