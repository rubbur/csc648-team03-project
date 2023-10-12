import { useEffect, useState } from "react";
import "./editPage.scss";
import { cookie } from "../../../App";
import axios from "axios";

const TutorEdit = ({isTutor}) =>{
const [subjects, setSubjects] = useState([
    {subject: "English", isChecked: false},
    {subject: "CS", isChecked: false},
    {subject: "Math", isChecked: false},
    {subject: "Physics", isChecked: false},
    {subject: "Sociology", isChecked: false},
    {subject: "Spanish", isChecked: false}, 
    {subject: "Music", isChecked: false},
    {subject: "Theater", isChecked: false}]);
const [courseNumbers, setCourseNumbers] = useState([]);
const [courseNum, setCourseNum] = useState("");

    useEffect( () =>{
       

        const getTutorData = async () =>{
            //get the tutor's courses and subjects from database
            const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getUserData`, {username: cookie.get("userName")}, {withCredentials: true});
            //set the courseNumbers and subjects arrays
            if(!result.data.success){
                console.log(result.data.errorMessage);
                return;
            }

            //put all the tuto'rs courses in the courseNumbers array
            setCourseNumbers([...result.data.userData[0].courses.split(" ").filter( course => course!== "")]);
            let results = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/user/getTutorSubjects`,
                 {id: cookie.get("userId")},
                  {withCredentials: true});
                 const  subjectList = results.data.subjectList;
                  if(!results.data.success){
                    console.log(results.data.errorMessage);
                    return;
                }
                for(let sub of subjectList){
                    console.log(sub);
                    for(let i = 0; i< subjects.length; i++){
                        if(subjects[i].subject === sub.subject_name){
                            subjects[i].isChecked = true;
                        }
                    }
                }
                console.log(subjects);
                setSubjects([...subjects]);
        }

        if(!isTutor){
            return;
        }
        
        getTutorData();
    }, []);

    const deleteCourseNumber = (index) =>{
        console.log(index);
        if(courseNumbers.length === 1){
            setCourseNumbers([]);
            return;
        }
        courseNumbers.splice(index, 1);
        
        setCourseNumbers([...courseNumbers]);  
    }

    const addCourseNumber = () =>{
        if(courseNumbers.indexOf(courseNum) !== -1){
            return;
        }
        setCourseNumbers([...courseNumbers, courseNum]);
        setCourseNum("");
    }

    const handleEditTutor = async () => {
        //post the edits to the database
        const result =  await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/editTutorAbilities`, {
            id: cookie.get("userId"), 
            courses: courseNumbers,
        subjects: subjects },
        {withCredentials: true});
        if(result.data.success){
            alert("successfully updated abilities");
        }
        else{
            alert("Failed to update abilities: "+  result.data.errorMessage);
        }
    }

    const handleBecomeTutor = async () =>{
        const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/becomeTutor`, {userId: cookie.get("userId")}, {withCredentials: true});
        if(result.data.success){
            await handleEditTutor();
        }
    }

    const handleSubjectChange = (index) => {
        subjects[index].isChecked = !subjects[index].isChecked;
        setSubjects([...subjects]);
    }

    return (
        <div className="tutor-edit edit-form">
              <h2>{ isTutor ? "Edit Abilities..." : "Become a Tutor" }</h2>
            {!isTutor && <h3>Just fill out your abilities...</h3>}
            <div className="course-card-box">
              
                <h4>Your courses</h4>
                
                <div className="card-box">
                    {
                    (courseNumbers.length > 0) ?  courseNumbers.map((course, index) =>{
                         if(course !== "") return <CourseCard courseNumber={course} deleteCourseNumber={deleteCourseNumber} key={index} index={index}/>  
                        }) :
                        <p>No Courses Listed</p> 
                    }
                </div>
                Add Course: <input type="text" onChange={e => setCourseNum(e.target.value)} value={courseNum} />
                </div>
                <button onClick={addCourseNumber}>Confirm</button>
            
            <h4>Subjects</h4>
            <div className="subject-box">
               
                    {
                        subjects.map( (subject, index) =>{
                            return (
                                <div className="subject-checkbox" key={index}>
                                    <label htmlFor={subject.subject}>{subject.subject}</label>
                                    <input type="checkbox" checked={subject.isChecked} name={subject.subject} onChange={() =>{handleSubjectChange(index)}}/>
                                </div>
                            );
                        })
                    }
            </div>
            <button onClick = {isTutor ? handleEditTutor : handleBecomeTutor} className="submit-tutor-button">{isTutor ? "Apply Changes" : "Register as Tutor"}</button>
        </div>
    );
}


const CourseCard = ({courseNumber, deleteCourseNumber, index}) =>{

    return (
        <div className="course-card">
            <h1>{courseNumber}</h1>
            <button className="delete-button" onClick={() => deleteCourseNumber(index)}>X</button>

        </div>
    )
}



export default TutorEdit;