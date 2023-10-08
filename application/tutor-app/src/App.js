import React from 'react';
import './App.css';
import Navbar from './components/NavbarElements'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TutorView from './pages/TutorView';
import StudentView from './pages/StudentView';
import AboutUs from './pages/AboutUs';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages';
import Profile from './pages/Profile';
import Logout from './pages/Logout';

import bios from './data/Bios';
import Cookie from 'universal-cookie';
import Admin from './components/admin/Admin';
import UserProfile from './components/userProfile/UserProfile';
import SearchResults from './components/searchResults/SearchResults';

//icons from font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faHouse, faCoffee, faMagnifyingGlass, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

library.add(fab, faHouse, faRightFromBracket, faMagnifyingGlass, faGear);

export const cookie=new Cookie();

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/searchResults' element={<SearchResults />} />
        <Route path='/AdminPanel' element={< Admin/>} />
        {cookie.get("isLoggedIn") && cookie.get("isTutor") && <Route path='/TutorView' element={<TutorView />} />}
        {cookie.get("isLoggedIn") && !cookie.get("isTutor") && <Route path='/StudentView' element={<StudentView />} />}
        <Route path='/AboutUs' element={<AboutUs />} />
        {!cookie.get("isLoggedIn") && <Route path='/SignIn' element={<SignIn />} />}
        {!cookie.get("isLoggedIn") && <Route path='/SignUp' element={<SignUp />} />}
        {cookie.get("isLoggedIn") && <Route path='/Logout' element={<Logout />} />}
        <Route path="/Profile" element={<UserProfile/>}/>
        <Route path="/profiles/MichaelMathews" element={<Profile img="/images/Michael_Mathews.jpg" name="Michael Mathews" bio={bios.Michael_Mathews}/>} />
        <Route path="/profiles/DanialTahir" element={<Profile img="/images/Danial_Tahir.jpg" name="Danial Tahir" bio={bios.Danial_Tahir}/>} />
        <Route path="/profiles/AvaAlbert" element={<Profile img="/images/Ava_Albert.png" name="Ava Albert" bio={bios.Ava_Albert}/>} />
        <Route path="/profiles/GriffinEvans" element={<Profile img="/images/Griffin_Evans.jpg" name="Griffin Evans" bio={bios.Griffin_Evans}/>} />
        <Route path="/profiles/BryanMaldonado" element={<Profile img="/images/Bryan_Maldonado.jpg" name="Bryan Maldonado" bio={bios.Bryan_Maldonado}/>} />
        <Route path="/profiles/ClevelandPlonsey" element={<Profile img="/images/Cleveland_Plonsey.png" name="Cleveland Plonsey" bio={bios.Cleveland_Plonsey}/>} />
      </Routes>
    </Router>
  );
}

export default App;
