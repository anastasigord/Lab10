export default function BookingForm({
  values,
  onChange,
  onSubmit,
  isSubmitting,
  isSubmitDisabled,
  selectedSeatIds,
  selectedWagonLabel,
}) {
  return (
    <form className="booking-form" onSubmit={onSubmit}>

      <div className="booking-chips">
        <span className="info-chip">
          Вагон: {selectedWagonLabel || "не обрано"}
        </span>
        <span className="info-chip">
          Місця: {selectedSeatIds.length > 0 ? selectedSeatIds.join(", ") : "не обрано"}
        </span>
      </div>

      <div className="form-field">
        <span>Ім'я</span>
        <input
          name="name"
          type="text"
          required
          minLength="2"
          value={values.name}
          onChange={onChange}
          placeholder="Введіть ім'я пасажира"
        />
      </div>

      <div className="form-field">
        <span>Телефон</span>
        <input
          name="phone"
          type="tel"
          required
          pattern="^\+?[0-9\s\-()]{10,20}$"
          value={values.phone}
          onChange={onChange}
          placeholder="+380..."
        />
      </div>

      <div className="form-field">
        <span>Email</span>
        <input
          name="email"
          type="email"
          required
          value={values.email}
          onChange={onChange}
          placeholder="example@email.com"
        />
      </div>

      <button
        className="book-btn"
        type="submit"
        disabled={isSubmitting || isSubmitDisabled}
      >
        {isSubmitting ? "Зберігаємо..." : "Забронювати квитки"}
      </button>

    </form>
  );
}

