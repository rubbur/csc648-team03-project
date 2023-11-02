// Author:  Cleveland Plonsey, Michael Mathews
// Date: 10/18/2023
// Purpose: maps out all the review cards that the user has gotten from other users

import { useState, useEffect } from "react";
import axios from "axios";
import ReviewCard from "../../tutorProfile/ReviewCard"; // Import the ReviewCard component
import { cookie } from "../../../App";

const SeeReviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        // Fetch reviews from the backend
        async function fetchReviews() {
            try {
                const reviewResults = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tutor/getTutorReviews`, { id: cookie.get("userId") }, { withCredentials: true });
                if (!reviewResults.data.success) {
                    console.log(reviewResults.data.errorMessage);
                    return;
                }
                setReviews([...reviewResults.data.reviews]);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        }

        fetchReviews();
    }, []);

    return (
        <div className="see-reviews edit-form">
            <h2>{cookie.get("userName")}'s Reviews</h2>
            {reviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
            ))}
        </div>
    );
};

export default SeeReviews;
