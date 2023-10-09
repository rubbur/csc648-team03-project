import React, { useEffect , useState} from 'react';
import '../index.scss';
import ImageList from '../components/ImageList'; 
import {cookie} from "../App"

function StudentView() {
  const [userName, setUserName] = useState(cookie.get("userName"));
  useEffect(() => {
    document.title = "Tutors.tech: Welcome Student";
    cookie.addChangeListener(() => {
      setUserName(cookie.get("userName"));
    });
    setUserName(cookie.get("userName"));
  }, []);
  return (
    <div>
      <h1 className='pageHeader'>Welcome Student {userName}</h1>
      
    </div>
  );
}

export default StudentView;