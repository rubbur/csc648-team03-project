import { useState, useEffect } from "react";
import "./reviewCard.scss";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const renderStars = (rating) => {
    const fullStars = Array.from({ length: rating }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={["fas", "star"]} 
        className="star"
      />
    ));
    const emptyStars = Array.from({ length: 5 - rating }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={["far", "star"]} 
        className="star"
      />
    ));
    return [...fullStars, ...emptyStars];
  };

  const ReviewCard = ({ review }) => {
    const [reviewerPhoto, setReviewerPhoto] = useState("");
  
    useEffect(() => {
      const getReviewerPhoto = async () => {
        const result = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/user/getUserData`,
          { username: review.reviewer_name },
          { withCredentials: true }
        );
        if (!result.data.success) {
          console.log(result.data.errorMessage);
          console.log("Could not get reviewer photo");
          return;
        }
        setReviewerPhoto(result.data.userData[0].img_url);
      };
      getReviewerPhoto();
    }, [review.reviewer_name]);
  return (
    <div className="review-card">
      <div className="reviewer-container">
        <img src={reviewerPhoto} alt="" />
        <p className="review-name">{review.reviewer_name}</p>
      </div>
      <div className="rating-date">
        <p className="rating">{renderStars(review.rating)}</p>
        <p>Date: {review.time_stamp}</p>
      </div>
      <div className="card-container">
        <p className="review">{review.review}</p>
      </div>
    </div>
  );
};

export default ReviewCard;