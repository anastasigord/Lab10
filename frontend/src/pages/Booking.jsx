import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [train, setTrain] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/trains`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((t) => String(t.id) === id);
        setTrain(found);
      });
  }, [id]);

  if (!train) {
    return <h2 className="loading">Завантаження...</h2>;
  }

  return (
    <div className="page">
      <div className="container">

        <div className="booking-card">

          <div className="booking-top">
            <span className="booking-label">
              BOOKING INFORMATION
            </span>

            <h1>
              {train.from} → {train.to}
            </h1>

            <p>Потяг {train.number}</p>
          </div>

          <div className="booking-details">

            <div className="booking-info">
              <span>Відправлення</span>
              <strong>{train.departure}</strong>
            </div>

            <div className="booking-info">
              <span>Тривалість</span>
              <strong>{train.duration}</strong>
            </div>

            <div className="booking-info">
              <span>Маршрут</span>
              <strong>
                {train.from} → {train.to}
              </strong>
            </div>

          </div>

          <div className="booking-actions">

            <button
              className="back-btn"
              onClick={() => navigate("/")}
            >
              Назад
            </button>

            <button className="book-btn">
              Підтвердити бронювання
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}