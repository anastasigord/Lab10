import express from "express";
import cors from "cors";
import trainRoutes from "./routes/trains.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/trains", trainRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Railway backend running" });
});

export default app;