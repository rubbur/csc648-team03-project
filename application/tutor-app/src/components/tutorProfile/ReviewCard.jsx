import { useState, useEffect } from "react";
import "./reviewCard.scss";
import axios from "axios";

const ReviewCard = ({review}) => {
    const [reviewerPhoto, setReviewerPhoto] = useState("");

    useEffect(() => {
        const getReviewerPhoto = async () => {
            const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getUserData`, {username: review.reviewer_name}, {withCredentials: true});
            if(!result.data.success){
                console.log(result.data.errorMessage);
                console.log("Could not get reviewer photo");
                return;
            }
            setReviewerPhoto(result.data.userData[0].img_url);
        }
        getReviewerPhoto();

    }, []);
    return (
        <div className="review-card">
            <div className="rating-date">
            <p className="rating">{
                (() => {
                    let rating = "";
                    for(let i = 0; i < review.rating; i++){
                        rating += "⭐";
                    }
                    return rating;
                })()
            }</p><p>{review.time_stamp}</p></div>
            <div className="card-container">
                <img src={reviewerPhoto} alt="" />
                <p className="review">{review.review}</p>
            </div>
        </div>
    )

}

export default ReviewCard;