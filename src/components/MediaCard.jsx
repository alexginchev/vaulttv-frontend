import { Link } from 'react-router-dom';

function MediaCard({ media }) {
  const posterSrc = media.posterUrl
    ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${media.posterUrl}`
    : null;

  return (
    <Link to={`/media/${media.id}`} className="media-card">
      {posterSrc ? (
        <img src={posterSrc} alt={media.title} loading="lazy" />
      ) : (
        <div className="media-card-placeholder">{media.title}</div>
      )}
      <p className="media-card-title">{media.title}</p>
    </Link>
  );
}

export default MediaCard;