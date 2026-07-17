import { useEffect, useState } from 'react';
import { getMyWatchlist, removeFromWatchlist } from '../api/watchlistApi';
import MediaCard from '../components/MediaCard';

function Watchlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWatchlist = () => {
    setLoading(true);
    getMyWatchlist()
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleRemove = async (mediaId) => {
    await removeFromWatchlist(mediaId);
    setItems((prev) => prev.filter((i) => i.mediaId !== mediaId));
  };

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="watchlist-page">
      <h1>My Watchlist</h1>

      {items.length === 0 ? (
        <p className="page-loading">Your watchlist is empty. Add something from the Library.</p>
      ) : (
        <div className="watchlist-grid">
          {items.map((item) => (
            <div key={item.id} className="watchlist-item">
              <MediaCard media={{ id: item.mediaId, title: item.mediaTitle, posterUrl: item.posterUrl }} />
              <button className="watchlist-remove" onClick={() => handleRemove(item.mediaId)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;