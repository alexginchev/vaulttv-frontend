import MediaCard from './MediaCard';

function Carousel({ title, items }) {
  if (!items.length) return null;

  return (
    <section className="carousel">
      <h2 className="carousel-title">{title}</h2>
      <div className="carousel-track">
        {items.map((item) => (
          <MediaCard key={item.id} media={item} />
        ))}
      </div>
    </section>
  );
}

export default Carousel;