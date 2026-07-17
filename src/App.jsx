import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Library from './pages/Library';
import AdminDashboard from './pages/AdminDashboard';
import MediaForm from './pages/MediaForm';
import './components/Navbar.css';
import './components/Hero.css';
import './components/Carousel.css';
import './components/MediaCard.css';
import MediaDetail from './pages/MediaDetail';
import './pages/MediaDetail.css';
import Watchlist from './pages/Watchlist';
import './pages/Watchlist.css';
import Rankings from './pages/Rankings';
import RankingDetail from './pages/RankingDetail';
import RankingListForm from './pages/RankingListForm';
import './pages/Rankings.css';



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Library />} />
        <Route path="/media/:id" element={<MediaDetail />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/rankings/:listId" element={<RankingDetail />} />
        <Route path="/admin/rankings/new" element={<AdminRoute><RankingListForm /></AdminRoute>} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/media/new" element={<AdminRoute><MediaForm /></AdminRoute>} />
        <Route path="/admin/media/:id/edit" element={<AdminRoute><MediaForm /></AdminRoute>} />
      </Routes>
    </>
  );
}

export default App;