import {useState, useEffect} from 'react';
import axios from "axios";
import "./tutorProfile.scss";

const TutorProfile = () => {
    const [tutorData, setTutorData] = useState({});
    const [tutorSubjects, setTutorSubjects] = useState([]);
    const [reviewList, setReviewList] = useState([]);

    useEffect(() => {
        //get the tutor's id from the url query string
        const urlParams = new URLSearchParams(window.location.search);
        const tutorUsername = urlParams.get('user');
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
            const reviewResults = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tutor/getTutorReviews`, {id: result.data.userData[0].id}, {withCredentials: true});
            if(!reviewResults.data.success){
                console.log(reviewResults.data.errorMessage);
                return;
            }
            setReviewList([...reviewResults.data.reviewList]);
        }
        getTutorData();
    }, []);

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