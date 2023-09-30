import { useState } from "react";
import "./editPage.css";

const TutorEdit = () =>{
const [subjects, setSubjects] = useState([]);
const [courseNumbers, setCourseNumbers] = useState([]);
const [courseNum, setCourseNum] = useState("");

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

    return (
        <div className="tutor-edit edit-form">
            <h2>Become a Tutor</h2>
            <h3>Just fill out your abilities...</h3>
            <div className="course-card-box">
                <p> Add a course number to your list of capabilities</p>
                <input type="text" onChange={e => setCourseNum(e.target.value)} value={courseNum} />
                <button onClick={addCourseNumber}>Confirm</button>
                <div className="card-box">
                    {
                        courseNumbers.map((course, index) =>{
                          return <CourseCard courseNumber={course} deleteCourseNumber={deleteCourseNumber} key={index} index={index}/>  
                        }) 
                    }
                </div>
            
            <div>

            </div>
            </div>
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