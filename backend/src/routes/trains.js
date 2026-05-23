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
  res.json(result);

export default router;