import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllRankingLists } from '../api/rankingsApi';
import { useAuth } from '../context/AuthContext';

function Rankings() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    getAllRankingLists()
      .then((res) => setLists(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="rankings-page">
      <div className="rankings-header">
        <h1>Rankings</h1>
        {isAdmin && <Link to="/admin/rankings/new" className="admin-btn">+ New List</Link>}
      </div>

      {lists.length === 0 ? (
        <p className="page-loading">No ranking lists yet.</p>
      ) : (
        <div className="rankings-grid">
          {lists.map((list) => (
            <Link key={list.id} to={`/rankings/${list.id}`} className="ranking-list-card">
              <h2>{list.title}</h2>
              {list.description && <p>{list.description}</p>}
              <span className="ranking-count">{list.entries.length} entries</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Rankings;