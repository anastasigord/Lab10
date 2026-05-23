export default function TrainCard({ train }) {
  return (
    <div className="card">
      <h3>🚆 {train.number}</h3>

      <p>{train.from} → {train.to}</p>
      <p>⏰ {train.departure}</p>
      <p>⏳ {train.duration}</p>
    </div>
  );
}