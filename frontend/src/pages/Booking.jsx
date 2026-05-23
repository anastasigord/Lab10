import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WagonSelector from "../components/WagonSelector";
import SeatMap from "../components/SeatMap";
import BookingForm from "../components/BookingForm";
import { getTrainDetails, getWagonSeats, createBooking } from "../services/BookingService";

function formatDateTime(value) {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [train, setTrain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedWagonId, setSelectedWagonId] = useState("");
  const [seats, setSeats] = useState([]);
  const [isSeatsLoading, setIsSeatsLoading] = useState(false);
  const [seatsError, setSeatsError] = useState("");

  const [selectedSeatIds, setSelectedSeatIds] = useState([]);

  const [formValues, setFormValues] = useState({ name: "", phone: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadTrain() {
      try {
        setIsLoading(true);
        setError("");
        const data = await getTrainDetails(id, controller.signal);
        setTrain(data);
        setSelectedWagonId(data.wagons[0]?.id || "");
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadTrain();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!selectedWagonId) return;
    const controller = new AbortController();

    async function loadSeats() {
      try {
        setIsSeatsLoading(true);
        setSeatsError("");
        setSelectedSeatIds([]);
        setBookingError("");
        setBookingSuccess("");
        const data = await getWagonSeats(id, selectedWagonId, controller.signal);
        setSeats(data.seats);
      } catch (err) {
        if (err.name !== "AbortError") setSeatsError(err.message);
      } finally {
        if (!controller.signal.aborted) setIsSeatsLoading(false);
      }
    }

    loadSeats();
    return () => controller.abort();
  }, [id, selectedWagonId]);

  function handleToggleSeat(seatId) {
    setSelectedSeatIds((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  }

  function handleFieldChange(e) {
    const { name, value } = e.target;
    if (bookingError) setBookingError("");
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (selectedSeatIds.length === 0) {
      setBookingError("Спочатку оберіть хоча б одне місце.");
      return;
    }
    if (!formValues.name.trim() || !formValues.phone.trim() || !formValues.email.trim()) {
      setBookingError("Заповніть усі поля форми.");
      return;
    }

    try {
      setIsSubmitting(true);
      setBookingError("");
      setBookingSuccess("");

      await createBooking({
        trainId: id,
        wagonId: selectedWagonId,
        seatIds: selectedSeatIds,
        name: formValues.name.trim(),
        phone: formValues.phone.trim(),
        email: formValues.email.trim(),
      });

      setBookingSuccess("Бронювання успішно створено!");
      setFormValues({ name: "", phone: "", email: "" });
      const data = await getWagonSeats(id, selectedWagonId);
      setSeats(data.seats);
      setSelectedSeatIds([]);
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <h2 className="loading">Завантаження...</h2>;
  if (error) return <h2 className="loading">{error}</h2>;
  if (!train) return null;

  return (
    <div className="page">
      <div className="container">

        <div className="booking-card">

          <div className="booking-top">
            <span className="booking-label">BOOKING INFORMATION</span>
            <h1>{train.from} → {train.to}</h1>
            <p>Потяг {train.number}</p>
          </div>

          <div className="booking-details">
            <div className="booking-info">
              <span>Відправлення</span>
              <strong>{formatDateTime(train.departureTime)}</strong>
            </div>
            <div className="booking-info">
              <span>Прибуття</span>
              <strong>{formatDateTime(train.arrivalTime)}</strong>
            </div>
            <div className="booking-info">
              <span>Тривалість</span>
              <strong>{train.duration}</strong>
            </div>
          </div>

          <div className="booking-section">
            <h3>Оберіть вагон</h3>
            <WagonSelector
              wagons={train.wagons}
              selectedWagonId={selectedWagonId}
              onSelect={setSelectedWagonId}
            />
          </div>

          <div className="booking-section">
            <h3>Оберіть місця</h3>

            <div className="seat-legend">
              <span><span className="legend-dot legend-available"></span> Вільні</span>
              <span><span className="legend-dot legend-selected"></span> Обрані</span>
              <span><span className="legend-dot legend-booked"></span> Заброньовані</span>
            </div>

            {seatsError && <p className="error-msg">{seatsError}</p>}
            {isSeatsLoading && <p className="loading">Завантажуємо місця...</p>}
            {!isSeatsLoading && !seatsError && (
              <SeatMap
                seats={seats}
                selectedSeatIds={selectedSeatIds}
                onToggleSeat={handleToggleSeat}
              />
            )}
          </div>

          <div className="booking-section">
            <h3>Оформлення бронювання</h3>

            {bookingError && <p className="error-msg">{bookingError}</p>}
            {bookingSuccess && <p className="success-msg">{bookingSuccess}</p>}

            <BookingForm
              values={formValues}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isSubmitDisabled={!selectedWagonId || selectedSeatIds.length === 0}
              selectedSeatIds={selectedSeatIds}
              selectedWagonLabel={
                train.wagons.find((w) => w.id === selectedWagonId)?.id.replace("wagon-", "") || ""
              }
            />
          </div>

          <div className="booking-actions">
            <button className="back-btn" onClick={() => navigate("/")}>
              ← Назад
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

