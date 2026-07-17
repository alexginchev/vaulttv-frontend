import { Link } from 'react-router-dom';

function Hero({ media }) {
  if (!media) return null;

  const apiRoot = import.meta.env.VITE_API_URL.replace('/api', '');
  const backdropSrc = media.backdropUrl ? `${apiRoot}${media.backdropUrl}` : null;

  return (
    <div className="hero" style={backdropSrc ? { backgroundImage: `url(${backdropSrc})` } : undefined}>
      <div className="hero-overlay">
        <h1 className="hero-title">{media.title}</h1>
        <p className="hero-description">{media.description}</p>
        <div className="hero-actions">
          <Link to={`/media/${media.id}`} className="hero-btn primary">More Info</Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;