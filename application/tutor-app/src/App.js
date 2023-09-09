import React from 'react';
import './App.css';
import Navbar from './components/NavbarElements'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/AboutUs' element={<AboutUs />} />
        <Route path='/SignIn' element={<SignIn />} />
        <Route path='/SignUp' element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
