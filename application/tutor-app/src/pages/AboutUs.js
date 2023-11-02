// Author:  Michael Mathews, Cleveland Plonsey
// Date: 8/27/2023
// Purpose: View of all developers who worked on this site.

import React, { useEffect } from "react";
import "../index.scss";
import ImageList from "../components/ImageList";

function AboutUs() {
  useEffect(() => {
    document.title = "Tutors.tech: About Us";
  }, []);
  return (
    <div>
      <h1 className="pageHeader">About Us</h1>
      <h2 className="pageHeader">Software Engineering 648 Team 3</h2>
      <ImageList />
    </div>
  );
}

export default AboutUs;
