export default function WagonSelector({ wagons, selectedWagonId, onSelect }) {
  return (
    <div className="wagon-grid">
      {wagons.map((wagon) => {
        const isActive = wagon.id === selectedWagonId;

        return (
          <button
            key={wagon.id}
            className={`wagon-card${isActive ? " wagon-card-active" : ""}`}
            onClick={() => onSelect(wagon.id)}
          >
            <span className="train-badge">
              Вагон {wagon.id.replace("wagon-", "")}
            </span>
            <strong>{wagon.type}</strong>
            <span>{wagon.seatCount} місць</span>
          </button>
        );
      })}
    </div>
  );
}

