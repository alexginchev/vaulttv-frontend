function AmbientBackground() {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 3,
    duration: 14 + Math.random() * 12,
    delay: Math.random() * 10,
  }));

  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-blob one" />
      <div className="ambient-blob two" />
      <div className="ambient-blob three" />
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: '-20px',
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default AmbientBackground;