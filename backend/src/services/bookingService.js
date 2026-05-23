import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { readJsonFile, writeJsonFile } from "../utils/jsonFileStore.js";
 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bookingsFile = path.join(__dirname, "..", "data", "bookings.json");
 
async function readBookings() {
  return readJsonFile(bookingsFile, []);
}
 
export async function getBookingsByTrainAndWagon(trainId, wagonId) {
  const bookings = await readBookings();
  return bookings.filter((b) => b.trainId === trainId && b.wagonId === wagonId);
}
 
export async function createBooking(payload) {
  const bookings = await readBookings();
  const booking = {
    id: crypto.randomUUID(),
    trainId: payload.trainId,
    wagonId: payload.wagonId,
    seatIds: payload.seatIds,
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  await writeJsonFile(bookingsFile, bookings);
  return booking;
}