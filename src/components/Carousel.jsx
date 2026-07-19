import MediaCard from './MediaCard';

function Carousel({ title, items, index = 0 }) {
  if (!items.length) return null;

  return (
    <section className="carousel" style={{ '--i': index }}>
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

export default Carousel;