function RankBadge({ rank }) {
  if (!rank) return null;

  const tier = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'standard';

  return (
    <span className={`rank-badge rank-badge-${tier}`}>
      #{rank}
    </span>
  );
}

export default RankBadge;