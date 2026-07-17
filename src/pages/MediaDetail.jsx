import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMediaById, deleteMedia } from '../api/mediaApi';
import { getMyWatchlist, addToWatchlist, removeFromWatchlist } from '../api/watchlistApi';
import { useAuth } from '../context/AuthContext';

function MediaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistBusy, setWatchlistBusy] = useState(false);

  useEffect(() => {
    getMediaById(id)
      .then((res) => setMedia(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    if (user) {
      getMyWatchlist()
        .then((res) => setInWatchlist(res.data.some((w) => w.mediaId === Number(id))))
        .catch(() => {});
    }
  }, [id, user]);

  const handleWatchlistToggle = async () => {
    setWatchlistBusy(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist(id);
        setInWatchlist(false);
      } else {
        await addToWatchlist(Number(id));
        setInWatchlist(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setWatchlistBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${media.title}"? This can't be undone.`)) return;
    await deleteMedia(id);
    navigate('/');
  };

  if (loading) return <div className="page-loading">Loading...</div>;
  if (!media) return <div className="page-loading">Media not found.</div>;

  const apiRoot = import.meta.env.VITE_API_URL.replace('/api', '');
  const backdropSrc = media.backdropUrl ? `${apiRoot}${media.backdropUrl}` : null;
  const posterSrc = media.posterUrl ? `${apiRoot}${media.posterUrl}` : null;

  return (
    <div className="detail-page">
      <div
        className="detail-backdrop"
        style={backdropSrc ? { backgroundImage: `url(${backdropSrc})` } : undefined}
      >
        <div className="detail-backdrop-overlay" />
      </div>

      <div className="detail-content">
        <div className="detail-poster">
          {posterSrc ? (
            <img src={posterSrc} alt={media.title} />
          ) : (
            <div className="media-card-placeholder">{media.title}</div>
          )}
        </div>

        <div className="detail-info">
          <h1>{media.title}</h1>
          <div className="detail-meta">
            {media.year && <span>{media.year}</span>}
            {media.rating && <span>★ {media.rating}</span>}
            {media.type === 'show' && media.seasons && <span>{media.seasons} seasons</span>}
            {media.type === 'movie' && media.runtime && <span>{media.runtime}</span>}
          </div>

          {media.genres.length > 0 && (
            <div className="detail-genres">
              {media.genres.map((g) => <span key={g} className="genre-tag">{g}</span>)}
            </div>
          )}

          <p className="detail-description">{media.description}</p>

          {media.director && <p className="detail-director">Directed by {media.director}</p>}

          <div className="detail-actions">
            {user && (
              <button onClick={handleWatchlistToggle} disabled={watchlistBusy} className="watchlist-btn">
                {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
            )}

            {isAdmin && (
              <>
                <Link to={`/admin/media/${id}/edit`} className="admin-btn">Edit</Link>
                <button onClick={handleDelete} className="admin-btn danger">Delete</button>
              </>
            )}
          </div>

          {media.cast.length > 0 && (
            <div className="detail-cast">
              <h2>Cast</h2>
              <div className="cast-list">
                {media.cast.map((c) => (
                  <div key={c.actorId} className="cast-member">
                    <p className="cast-name">{c.actorName}</p>
                    {c.role && <p className="cast-role">{c.role}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaDetail;