function StatCard({ title, value, tone = 'neutral' }) {
  return (
    <div className={`stat-card ${tone}`}>
      <p>{title}</p>
      <strong>{value}</strong>
    </div>
  );
}

export default StatCard;
