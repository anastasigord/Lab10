import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [trains, setTrains] = useState([]);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/trains")
      .then((res) => res.json())
      .then((data) => setTrains(data));
  }, []);

  const filtered = trains.filter(
    (t) =>
      t.number.toLowerCase().includes(query.toLowerCase()) ||
      t.from.toLowerCase().includes(query.toLowerCase()) ||
      t.to.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page">
      <div className="container">

        <section className="hero">
          <span className="hero-label">
            RAILWAY TICKET SALES SYSTEM
          </span>

          <h1>
            Пошук рейсів для
            <br />
            бронювання квитків
          </h1>

          <p>Пошук за номером потяга або маршрутом</p>

          <input
            type="text"
            placeholder="Наприклад: 091К або Київ"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </section>

        <section className="results">
          <div className="results-header">
            <span>ДОСТУПНІ РЕЙСИ</span>
            <h2>{filtered.length} знайдено</h2>
          </div>

          <div className="cards">

            {filtered.map((train) => (
              <div className="card" key={train.id}>

                <div className="train-badge">
                  Потяг {train.number}
                </div>

                <h3>
                  {train.from} → {train.to}
                </h3>

                <div className="info-block">
                  <span>Відправлення</span>
                  <strong>{train.departure}</strong>
                </div>

                <div className="info-block">
                  <span>Тривалість</span>
                  <strong>{train.duration}</strong>
                </div>

               <button
                  onClick={() => navigate(`/booking/${train.id}`)}
>
                      Обрати квиток
               </button>

              </div>
            ))}

          </div>
        </section>

      </div>
    </div>
  );
}