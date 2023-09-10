import React from 'react';
import './App.css';
import Navbar from './components/NavbarElements'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages';
import Profile from './pages/Profile';

import MichaelMathewsBio from './data/Michael_Mathews.txt';
import DanialTahirBio from './data/Danial_Tahir.txt';
import AvaAlbertBio from './data/Ava_Albert.txt';
import GriffinEvansBio from './data/Griffin_Evans.txt';
import BryanMaldonadoBio from './data/Bryan_Maldonado.txt';
import ClevelandPlonseyBio from './data/Cleveland_Plonsey.txt';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/AboutUs' element={<AboutUs />} />
        <Route path='/SignIn' element={<SignIn />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path="/profiles/MichaelMathews" element={<Profile img="/images/favicon.png" name="Michael Mathews" bio={MichaelMathewsBio}/>} />
        <Route path="/profiles/DanialTahir" element={<Profile img="/images/favicon.png" name="Danial Tahir" bio={DanialTahirBio}/>} />
        <Route path="/profiles/AvaAlbert" element={<Profile img="/images/favicon.png" name="Ava Albert" bio={AvaAlbertBio}/>} />
        <Route path="/profiles/GriffinEvans" element={<Profile img="/images/favicon.png" name="Griffin Evans" bio={GriffinEvansBio}/>} />
        <Route path="/profiles/BryanMaldonado" element={<Profile img="/images/favicon.png" name="Bryan Maldonado" bio={BryanMaldonadoBio}/>} />
        <Route path="/profiles/ClevelandPlonsey" element={<Profile img="/images/favicon.png" name="Cleveland Plonsey" bio={ClevelandPlonseyBio}/>} />
      </Routes>
    </Router>
  );
}

export default App;
