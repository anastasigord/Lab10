const BASE_URL = "http://localhost:3000/api";
 
export async function getTrainDetails(trainId, signal) {
  const res = await fetch(`${BASE_URL}/trains/${trainId}`, { signal });
  if (!res.ok) throw new Error("Не вдалося завантажити дані рейсу.");
  return res.json();
}