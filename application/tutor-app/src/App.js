import React from 'react';
import './App.css';
import Navbar from './components/NavbarElements'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages';
import MichaelMathews from './pages/profiles/MichaelMathews';
import DanialTahir from './pages/profiles/DanialTahir';
import AvaAlbert from './pages/profiles/AvaAlbert';
import GriffinEvans from './pages/profiles/GriffinEvans';
import BryanMaldonado from './pages/profiles/BryanMaldonado';
import ClevelandPlonsey from './pages/profiles/ClevelandPlonsey';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/AboutUs' element={<AboutUs />} />
        <Route path='/SignIn' element={<SignIn />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path="/pages/profiles/MichaelMathews" element={<MichaelMathews />} />
        <Route path="/pages/profiles/DanialTahir" element={<DanialTahir />} />
        <Route path="/pages/profiles/AvaAlbert" element={<AvaAlbert />} />
        <Route path="/pages/profiles/GriffinEvans" element={<GriffinEvans />} />
        <Route path="/pages/profiles/BryanMaldonado" element={<BryanMaldonado />} />
        <Route path="/pages/profiles/ClevelandPlonsey" element={<ClevelandPlonsey />} />
      </Routes>
    </Router>
  );
}

export default App;
