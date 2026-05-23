import express from "express";
import trains from "../data/trains.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(trains);
});

router.get("/search", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  const result = trains.filter(train =>
    train.number.toLowerCase().includes(query) ||
    train.from.toLowerCase().includes(query) ||
    train.to.toLowerCase().includes(query)
  );

  res.json(result);
});

export default router;