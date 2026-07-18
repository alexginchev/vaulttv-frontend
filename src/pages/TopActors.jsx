import { useEffect, useState } from 'react';
import { getTop10, setActorRank, clearActorRank } from '../api/topActorsApi';
import { getActors } from '../api/actorsApi';
import { useAuth } from '../context/AuthContext';
import RankBadge from '../components/RankBadge';

function TopActors() {
  const { isAdmin } = useAuth();
  const [topActors, setTopActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssign, setShowAssign] = useState(false);
  const [assignSlot, setAssignSlot] = useState(null);
  const [allActors, setAllActors] = useState([]);
  const [pickerSearch, setPickerSearch] = useState('');

  const loadTop10 = () => {
    setLoading(true);
    getTop10()
      .then((res) => setTopActors(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTop10();
  }, []);

  const slots = Array.from({ length: 10 }, (_, i) => i + 1);
  const actorForSlot = (slot) => topActors.find((a) => a.topRank === slot);

  const openAssign = (slot) => {
    setAssignSlot(slot);
    setShowAssign(true);
    getActors({ search: pickerSearch || undefined }).then((res) => setAllActors(res.data));
  };

  const handleAssign = async (actorId) => {
    await setActorRank(actorId, assignSlot);
    setShowAssign(false);
    loadTop10();
  };

  const handleClear = async (actorId) => {
    await clearActorRank(actorId);
    loadTop10();
  };

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="top-actors-page">
      <h1>Top 10 Actors</h1>

      <div className="top-actors-grid">
        {slots.map((slot) => {
          const actor = actorForSlot(slot);
          return (
            <div key={slot} className="top-actor-card">
              <RankBadge rank={slot} />
              {actor ? (
                <>
                  <p className="top-actor-name">{actor.name}</p>
                  {actor.nationality && <p className="top-actor-meta">{actor.nationality}</p>}
                  {isAdmin && (
                    <div className="top-actor-admin-actions">
                      <button onClick={() => openAssign(slot)}>Replace</button>
                      <button onClick={() => handleClear(actor.id)} className="danger">Remove</button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="top-actor-empty">Empty slot</p>
                  {isAdmin && (
                    <button onClick={() => openAssign(slot)} className="assign-btn">Assign</button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {showAssign && (
        <div className="modal-overlay" onClick={() => setShowAssign(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Assign rank #{assignSlot}</h2>
            <input
              type="text"
              placeholder="Search actors..."
              value={pickerSearch}
              onChange={(e) => {
                setPickerSearch(e.target.value);
                getActors({ search: e.target.value || undefined }).then((res) => setAllActors(res.data));
              }}
              className="actor-search"
            />
            <div className="actor-picker-list">
              {allActors.map((a) => (
                <button key={a.id} className="actor-picker-item" onClick={() => handleAssign(a.id)}>
                  {a.name} {a.topRank && <RankBadge rank={a.topRank} />}
                </button>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowAssign(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopActors;