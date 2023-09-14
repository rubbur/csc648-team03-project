import React from 'react';
import './App.css';
import Navbar from './components/NavbarElements'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages';
import Profile from './pages/Profile';

import bios from './data/Bios';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/AboutUs' element={<AboutUs />} />
        <Route path='/SignIn' element={<SignIn />} />
        <Route path='/SignUp' element={<SignUp />} />
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
