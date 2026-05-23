const BASE_URL = "http://localhost:3000/api";

export async function getTrains() {
  const res = await fetch(`${BASE_URL}/trains`);
  return res.json();
}

export async function searchTrains(query) {
  const res = await fetch(`${BASE_URL}/trains/search?q=${query}`);
  return res.json();
}