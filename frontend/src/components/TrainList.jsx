import TrainCard from "./TrainCard";

export default function TrainList({ trains }) {
  return (
    <div>
      {trains.map((t) => (
        <TrainCard key={t.id} train={t} />
      ))}
    </div>
  );
}