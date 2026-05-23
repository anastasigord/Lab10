import express from "express";
import trains from "../data/trains.js";
import { getBookingsByTrainAndWagon } from "../services/bookingService.js";
import { buildSeatMap, collectBookedSeatIds } from "../utils/seatMap.js";
 
const router = express.Router();
 
router.get("/", (req, res) => {
  const search = String(req.query.q || "").trim().toLowerCase();
 
  const items = trains.filter((t) => {
    if (!search) return true;
    return (
      t.number.toLowerCase().includes(search) ||
      t.from.toLowerCase().includes(search) ||
      t.to.toLowerCase().includes(search)
    );
  });
 
  res.json(items);
});
 
router.get("/:trainId", (req, res) => {
  const train = trains.find((t) => t.id === req.params.trainId);
  if (!train) return res.status(404).json({ message: "Train not found." });
  return res.json(train);
});

router.get("/:trainId/wagons/:wagonId/seats", async (req, res, next) => {
  try {
    const train = trains.find((t) => t.id === req.params.trainId);
    if (!train) return res.status(404).json({ message: "Train not found." });
 
    const wagon = train.wagons.find((w) => w.id === req.params.wagonId);
    if (!wagon) return res.status(404).json({ message: "Wagon not found." });
 
    const bookings = await getBookingsByTrainAndWagon(train.id, wagon.id);
    const bookedIds = collectBookedSeatIds(bookings);
 
    return res.json({
      trainId: train.id,
      wagonId: wagon.id,
      wagonType: wagon.type,
      seats: buildSeatMap(wagon, bookedIds),
    });
  } catch (err) {
    return next(err);
  }
});
 
export default router;