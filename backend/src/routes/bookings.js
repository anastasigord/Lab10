import express from "express";
import trains from "../data/trains.js";
import { createBooking, getBookingsByTrainAndWagon } from "../services/bookingService.js";
import { collectBookedSeatIds } from "../utils/seatMap.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { trainId, wagonId, seatIds, name, phone, email } = req.body;

    if (!trainId || !wagonId || !name || !phone || !email || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ message: "Заповніть усі обов'язкові поля." });
    }

    const train = trains.find((t) => t.id === trainId);
    if (!train) return res.status(404).json({ message: "Потяг не знайдено." });

    const wagon = train.wagons.find((w) => w.id === wagonId);
    if (!wagon) return res.status(404).json({ message: "Вагон не знайдено." });

    const existing = await getBookingsByTrainAndWagon(trainId, wagonId);
    const bookedSet = new Set(collectBookedSeatIds(existing));
    const conflicts = seatIds.filter((s) => bookedSet.has(s));

    if (conflicts.length > 0) {
      return res.status(409).json({
        message: `Місця вже заброньовані: ${conflicts.join(", ")}.`,
      });
    }

    const booking = await createBooking({ trainId, wagonId, seatIds, name, phone, email });
    return res.status(201).json({ message: "Бронювання успішно створено.", booking });
  } catch (err) {
    return next(err);
  }
});

export default router;