import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Library from './pages/Library';
import './components/Navbar.css';
import './components/Hero.css';
import './components/Carousel.css';
import './components/MediaCard.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Library />} />
      </Routes>
    </>
  );
}

export default App;