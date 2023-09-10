import React from 'react';
import './App.css';
import Navbar from './components/NavbarElements'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/AboutUs' element={<AboutUs />} />
        <Route path='/SignIn' element={<SignIn />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path="/profiles/MichaelMathews" element={<Profile img="/images/favicon.png" name="Michael Mathews" bio="hi"/>} />
        <Route path="/profiles/DanialTahir" element={<Profile img="/images/favicon.png" name="Danial Tahir" bio=""/>} />
        <Route path="/profiles/AvaAlbert" element={<Profile img="/images/favicon.png" name="Ava Albert" bio=""/>} />
        <Route path="/profiles/GriffinEvans" element={<Profile img="/images/favicon.png" name="Griffin Evans" bio=""/>} />
        <Route path="/profiles/BryanMaldonado" element={<Profile img="/images/favicon.png" name="Bryan Maldonado" bio=""/>} />
        <Route path="/profiles/ClevelandPlonsey" element={<Profile img="/images/favicon.png" name="Cleveland Plonsey" bio=""/>} />
      </Routes>
    </Router>
  );
}

export default App;
