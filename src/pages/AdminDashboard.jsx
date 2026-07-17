import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="admin-page">
      <h1>Admin</h1>
      <div className="admin-links">
        <Link to="/admin/media/new" className="admin-link-card">+ Add Media</Link>
        <Link to="/admin/media" className="admin-link-card">Manage Media</Link>
        <Link to="/admin/actors" className="admin-link-card">Manage Actors</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;