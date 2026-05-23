const BASE_URL = "http://localhost:3000/api";

export async function getTrainDetails(trainId, signal) {
  const res = await fetch(`${BASE_URL}/trains/${trainId}`, { signal });
  if (!res.ok) throw new Error("Не вдалося завантажити дані рейсу.");
  return res.json();
}

export async function getWagonSeats(trainId, wagonId, signal) {
  const res = await fetch(
    `${BASE_URL}/trains/${trainId}/wagons/${wagonId}/seats`,
    { signal }
  );
  if (!res.ok) throw new Error("Не вдалося завантажити схему місць.");
  return res.json();
}

async function parseJson(res) {
  const raw = await res.text();
  const clean = raw.replace(/^\uFEFF/, "");
  try {
    return clean ? JSON.parse(clean) : {};
  } catch {
    throw new Error("Сервер повернув некоректну відповідь.");
  }
}

export async function createBooking(payload) {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.message || "Не вдалося створити бронювання.");
  return data;
}