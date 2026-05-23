export default function SeatMap({ seats, selectedSeatIds, onToggleSeat }) {
  return (
    <div className="seat-map">
      {seats.map((seat) => {
        const isSelected = selectedSeatIds.includes(seat.id);
        const isBooked = seat.status === "booked";

        let cls = "seat";
        if (isBooked) cls += " seat-booked";
        else if (isSelected) cls += " seat-selected";
        else cls += " seat-available";

        return (
          <button
            key={seat.id}
            className={cls}
            disabled={isBooked}
            onClick={() => onToggleSeat(seat.id)}
          >
            <span className="seat-number">{seat.id}</span>
            <span className="seat-pos">р.{seat.row} м.{seat.position}</span>
          </button>
        );
      })}
    </div>
  );
}

