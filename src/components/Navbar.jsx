import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import './NotificationBell.css';

function Navbar() {
  const { user, logoutUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">VaultTV</Link>
      <div className="navbar-links">
        <Link to="/">Library</Link>
        <Link to="/rankings">Rankings</Link>
        <Link to="/top-actors">Top Actors</Link>
        {user && <Link to="/watchlist">Watchlist</Link>}
        {isAdmin && <Link to="/admin">Admin</Link>}
      </div>
      <div className="navbar-auth">
        {user ? (
          <>
            {isAdmin && <NotificationBell />}
            <span className="navbar-username">{user.username}</span>
            <button onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <Link to="/login">Sign In</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;