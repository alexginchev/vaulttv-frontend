import { useEffect, useState } from 'react';
import { getAllMedia } from '../api/mediaApi';
import Hero from '../components/Hero';
import Carousel from '../components/Carousel';

function Library() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMedia()
      .then((res) => setMedia(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading...</div>;

  if (media.length === 0) {
    return (
      <div className="page-loading">
        No media yet. {/* Admin can add some once the admin forms exist */}
      </div>
    );
  }

  const heroItem = media[0]; // simplest pick for now — most recently added
  const movies = media.filter((m) => m.type === 'movie');
  const shows = media.filter((m) => m.type === 'show');

  // Group by genre for extra shelves — any media with at least one genre tag
  const genreMap = {};
  media.forEach((m) => {
    m.genres.forEach((g) => {
      if (!genreMap[g]) genreMap[g] = [];
      genreMap[g].push(m);
    });
  });

  return (
    <div className="library-page">
      <Hero media={heroItem} />
      <div className="library-shelves">
        <Carousel title="Movies" items={movies} />
        <Carousel title="Shows" items={shows} />
        {Object.entries(genreMap).map(([genre, items]) => (
          <Carousel key={genre} title={genre} items={items} />
        ))}
      </div>
    </div>
  );
}

export default Library;