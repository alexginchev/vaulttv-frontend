import { useEffect, useState, useCallback } from 'react';
import { getActors, deleteActor } from '../api/actorsApi';
import ActorEditModal from '../components/ActorEditModal';
import ActorImportModal from '../components/ActorImportModal';

function AdminActors() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('asc');
  const [incompleteOnly, setIncompleteOnly] = useState(false);
  const [editingActor, setEditingActor] = useState(null); // null | 'new' | actor object
  const [showImport, setShowImport] = useState(false);

  const loadActors = useCallback(() => {
    setLoading(true);
    getActors({ search: search || undefined, order, incompleteOnly: incompleteOnly || undefined })
      .then((res) => setActors(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [search, order, incompleteOnly]);

  useEffect(() => {
    const debounce = setTimeout(loadActors, 300); // avoid firing a request on every keystroke
    return () => clearTimeout(debounce);
  }, [loadActors]);

  const handleDelete = async (actor) => {
    if (!confirm(`Delete "${actor.name}"? This can't be undone.`)) return;
    await deleteActor(actor.id);
    loadActors();
  };

  return (
    <div className="admin-actors-page">
      <div className="admin-actors-header">
        <h1>Manage Actors</h1>
        <div className="admin-actors-actions">
          <button onClick={() => setShowImport(true)} className="admin-btn">Bulk Import</button>
          <button onClick={() => setEditingActor('new')} className="admin-btn primary">+ Add Actor</button>
        </div>
      </div>

      <div className="admin-actors-toolbar">
        <input
          type="text"
          placeholder="Search actors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="actor-search"
        />
        <button
          className="sort-toggle"
          onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
        >
          Name {order === 'asc' ? 'A–Z ↓' : 'Z–A ↑'}
        </button>
        <label className="incomplete-filter">
          <input
            type="checkbox"
            checked={incompleteOnly}
            onChange={(e) => setIncompleteOnly(e.target.checked)}
          />
          Incomplete only
        </label>
      </div>

      {loading ? (
        <p className="page-loading">Loading...</p>
      ) : actors.length === 0 ? (
        <p className="page-loading">No actors found.</p>
      ) : (
        <table className="actors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Nationality</th>
              <th>Born</th>
              <th>Status</th>
              <th>Top Rank</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {actors.map((actor) => (
              <tr key={actor.id} className={actor.isIncomplete ? 'row-incomplete' : ''}>
                <td>{actor.name}</td>
                <td>{actor.nationality || '—'}</td>
                <td>{actor.born || '—'}</td>
                <td>
                  {actor.isIncomplete ? (
                    <span className="badge-incomplete">Incomplete</span>
                  ) : (
                    <span className="badge-complete">Complete</span>
                  )}
                </td>
                <td>{actor.topRank ? `#${actor.topRank}` : '—'}</td>
                <td className="actor-row-actions">
                  <button onClick={() => setEditingActor(actor)}>Edit</button>
                  <button onClick={() => handleDelete(actor)} className="danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingActor && (
        <ActorEditModal
          actor={editingActor === 'new' ? null : editingActor}
          onClose={() => setEditingActor(null)}
          onSaved={() => { setEditingActor(null); loadActors(); }}
        />
      )}

      {showImport && (
        <ActorImportModal
          onClose={() => setShowImport(false)}
          onImported={() => { setShowImport(false); loadActors(); }}
        />
      )}
    </div>
  );
}

export default AdminActors;