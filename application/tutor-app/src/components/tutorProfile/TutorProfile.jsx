import { useState, useEffect } from 'react';
import axios from "axios";
import "./tutorProfile.scss";
import { cookie } from "../../App";
import ReviewCard from "./ReviewCard";
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const TutorProfile = () => {
    const initialReviewNum = 2;
    const [reviewList, setReviewList] = useState([]);
    const [postData, setPostData] = useState({});
    const [modalIsOpen, setIsOpen] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [starArray, setStarArray] = useState([false, false, false, false, false]);
    const [avgReview, setAvgReview] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);
    useEffect(() => {

        //get the post id from the url query string
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('postId');

        const getPostData = async () => {
            //load the tutor's profile data
            const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tutor/getPostById`, { postId: postId }, { withCredentials: true });
            if (!result.data.success) {
                console.log(result.data.errorMessage);
                return;
            }

            setPostData({ ...result.data.postData });

            //get the tutor's reviews
            const reviewResults = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tutor/getTutorReviews`, { id: result.data.postData.tutor_id }, { withCredentials: true });
            if (!reviewResults.data.success) {
                console.log(reviewResults.data.errorMessage);
                return;
            }
            setReviewList([...reviewResults.data.reviews]);
            //get the tutor's average review
            let total = 0;
            for (let i = 0; i < reviewResults.data.reviews.length; i++) {
                total += Number(reviewResults.data.reviews[i].rating);
            }
            if (reviewResults.data.reviews.length > 0) {
                total /= reviewResults.data.reviews.length;
                setAvgReview(total.toFixed(1));
            }
            else {
                setAvgReview("unrated");
            }
        }

        getPostData();
    }, []);

    const handleContact = () => {
        if (cookie.get("isLoggedIn") === "false") {
            //redirect to login page
            alert("need to be logged in to contact a tutor");
            return;
        }
        //open a chat with the tutor where student can send messages
        //open a modal that allows the student to send a message to the tutor
    }

    const handleReview = () => {
        if (cookie.get("isLoggedIn") === "false") {
            //redirect to login page
            alert("need to be logged in to review a tutor");
            return;
        }
        setIsOpen(true);
    }

    const submitReview = async () => {
        //send the review to the backend
        const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/submitReview`, {
            tutorId: postData.tutor_id,
            reviewText: reviewText,
            rating: starArray.reduce((total, current, index) => {
                if (current) {
                    return total + 1;
                }
                return total;
            }, 0),
            reviewerName: cookie.get("userName"),
            reviewerId: cookie.get("userId")
        }, { withCredentials: true });
        if (!result.data.success) {
            console.log(result.data.errorMessage);
            return;
        }
        setIsOpen(false);
    }

    return (
        <div className="tutor-profile">
            <div className="left-side-bar">
                <div className="image-subjects-box">
                    <img src={postData.img_url} alt={`profile pic of ${postData.username}`} />
                    <p id="subject-banner">{postData.subject} Tutor</p>
                </div>
                <div className="contact-review-controls">
                    <button className=" controls-button contact-button" onClick={handleContact}>Contact</button>
                    <button className=" controls-button review-button" onClick={handleReview}>Review</button>

                </div>
                <div className="review-box">
                    <h1 className='review-header'>Reviews</h1>
                    {(!showAllReviews && reviewList.length > 1) && <p id="review-showing-p">{`showing ${initialReviewNum} of ${reviewList.length}`}</p>}
                    {(reviewList.length === 0) ? <p>No reviews yet</p> :
                        reviewList.map((review, index) => {
                            if (showAllReviews || index < initialReviewNum)
                                return (
                                    <ReviewCard key={index} review={review} />
                                )
                        })
                    }
                    {reviewList.length > initialReviewNum && !showAllReviews && <button className="show-all-reviews-button" onClick={() => setShowAllReviews(true)}>See All Reviews</button>}
                    {reviewList.length > initialReviewNum && showAllReviews && <button className="show-all-reviews-button" onClick={() => setShowAllReviews(false)}>Hide Reviews</button>}
                </div>
            </div>
            <div className="main-content">
                <div className='username-rating-box'>
                    <p className='rating-p'>
                        {
                            reviewList.length === 0 ?
                                "unrated"
                                :
                                // the average rating is:
                                avgReview + "   "
                        }
                        <FontAwesomeIcon icon={["fas", "star"]} className="star" /></p>

                    <h1 className='tutor-header'>{postData.username}'s Post</h1>
                </div>
                <div className="about-me-box">
                    <h2>About Me</h2>
                    <p>{postData.description || "I am a really qualified tutor. I can teach stuff to people"}</p>
                </div>
            </div>
            {/*--------------------------------------Modal---------------------------------------------------------------------------------- */}
            <Modal ariaHideApp={false}
                className="custom-modal"
                isOpen={modalIsOpen}
                onRequestClose={() => setIsOpen(false)}
            >
                <button className="close-modal-button" onClick={() => setIsOpen(false)}>X</button>
                <div className="modal-content">
                    <h2>Review</h2>
                    <div className='star-holder'>
                        {starArray.map((star, index) => {
                            return (
                                <p key={index} onClick={() => setStarArray(starArray.map((star, i) => i <= index ? true : false))}><FontAwesomeIcon key={index} icon={`fa-${star ? "solid" : "regular"} fa-star`} className="star" /></p>
                            )
                        }
                        )}
                    </div>
                    <textarea rows="10" className="review-text" onChange={(e) => setReviewText(e.target.value)} />
                </div>
                <button className="submit-review-button" onClick={() => submitReview()}>Submit</button>
            </Modal>
        </div>
    )
}

export default TutorProfile;