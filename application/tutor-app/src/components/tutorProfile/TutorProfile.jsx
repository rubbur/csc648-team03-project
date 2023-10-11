import {useState, useEffect} from 'react';
import axios from "axios";
import "./tutorProfile.scss";
import {cookie} from "../../App";
import ReviewCard from "./ReviewCard";

const TutorProfile = () => {
    const [tutorData, setTutorData] = useState({});
    const [tutorSubjects, setTutorSubjects] = useState([]);
    const [reviewList, setReviewList] = useState([]);
    const [subjectSelected, setSubjectSelected] = useState("overview");
    const [subjectInfo, setSubjectInfo] = useState({}); //contains the bio, video and pdf post for the subject selected

    useEffect(() => {
        
        //get the tutor's id from the url query string
        const urlParams = new URLSearchParams(window.location.search);
        const tutorUsername = urlParams.get('user');
        //get the tutor's subject from the url query string
        setSubjectSelected(urlParams.get('subject'));
        const getTutorData = async () => {
            //load the tutor's profile data
            const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getUserData`, {username: tutorUsername }, {withCredentials: true});
            if(!result.data.success){
                console.log(result.data.errorMessage);
                return;
            }
            console.log("id is: " +result.data.userData[0].id);
            setTutorData({...result.data.userData[0]});
            // TODO: change the getTutorSubjects route to /tutor/getTutorSubjects
            const results = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getTutorSubjects`, {id: result.data.userData[0].id}, {withCredentials: true});
            if(!results.data.success){
                console.log(results.data.errorMessage);
                return;
            }
            setTutorSubjects([...results.data.subjectList]);
            
            //get the tutor's reviews
            const reviewResults = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tutor/getTutorReviews`, {id: result.data.userData[0].id}, {withCredentials: true});
            if(!reviewResults.data.success){
                console.log(reviewResults.data.errorMessage);
                return;
            }
            setReviewList([...reviewResults.data.reviews]);
        }
        getTutorData();
    }, []);

   const  handleContact = () => {
    if(cookie.get("isLoggedIn") === "false"){
        //redirect to login page
        alert("need to be logged in to contact a tutor");
        return;
    }
    //open a chat with the tutor where student can send messages
   //open a modal that allows the student to send a message to the tutor
   }

    const handleReview = () => {
        if(cookie.get("isLoggedIn") === "false"){
            //redirect to login page
            alert("need to be logged in to review a tutor");
            return;
        }
        //open a modal that allows the student to review the tutor
        //modal needs to have a text box for the review and a rating system
        //modal needs to have a submit button that sends the review to the backend

    }
    return (
        <div className="tutor-profile">
            <div className="left-side-bar">
                <div className="image-subjects-box">
                    <img src={tutorData.img_url} alt={`profile pic of ${tutorData.username}`} />
                    <div className='subject-list'>
                    {
                        tutorSubjects && tutorSubjects.map((subject, index) => {
                            console.log(subject);
                            return (
                                <p key={index}>{subject.subject_name}</p>
                            )
                        })
                    }
                    </div>
                </div>
                <div className="contact-review-controls">
                    <button className=" controls-button contact-button" onClick={handleContact}>Contact</button>
                    <button className=" controls-button review-button" onClick={handleReview}>Review</button>

                </div>
                <div className="review-box">
                    <h2>Reviews</h2>
                    { (reviewList.length === 0) ? <p>No reviews yet</p> :
                        reviewList.map((review, index) => {
                            return (
                              <ReviewCard key={index} review={review} />
                            )
                        })
                    }
                </div>
            </div>
            <div className="main-content">
                <div className='username-rating-box'>
                    <p className='rating-p'>4.5</p> 
                    {/* TODO: add tutorData.rating instead of 7 */}
                    <h1>{tutorData.username}</h1>
                </div>
                <div className="about-me-box">
                    <h2>About Me</h2>
                    <p>{tutorData.bio || "I am a really qualified tutor. I can teach stuff to people"}</p>
                </div>
            </div>
            
        </div>
    )
}

export default TutorProfile;