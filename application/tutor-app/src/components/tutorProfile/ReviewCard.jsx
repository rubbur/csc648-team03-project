import { useState, useEffect } from "react";
import "./reviewCard.scss";
import axios from "axios";

const ReviewCard = ({review}) => {
    const [reviewerPhoto, setReviewerPhoto] = useState("");

    useEffect(() => {
        const getReviewerPhoto = async () => {
            const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getUserData`, {id: review.reviewer_id}, {withCredentials: true});
            if(!result.data.success){
                console.log(result.data.errorMessage);
                return;
            }
            setReviewerPhoto(result.data.userData[0].img_url);
        }
        getReviewerPhoto();

    }, []);
    return (
        <div className="review-card">
            <img src={reviewerPhoto} alt="" />
            <p>{review.review_text}</p>
            <p>{review.rating}</p>
            <p>{review.time_stamp}</p>
        </div>
    )

}

export default ReviewCard;