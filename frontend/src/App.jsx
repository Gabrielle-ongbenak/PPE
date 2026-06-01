import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Search from './pages/Search';
import HousingDetail from './pages/HousingDetail';
import Favorites from './pages/Favorites';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Assistant from './pages/Assistant';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/housing/:id" element={<HousingDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/assistant" element={<Assistant />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
