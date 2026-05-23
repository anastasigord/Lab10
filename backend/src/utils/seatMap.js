export function collectBookedSeatIds(bookings) {
  return bookings.flatMap((b) => b.seatIds);
}
 
export function buildSeatMap(wagon, bookedSeatIds = []) {
  const booked = new Set(bookedSeatIds);
  const seats = [];
 
  for (let num = 1; num <= wagon.seatCount; num++) {
    const row = Math.ceil(num / wagon.seatsPerRow);
    const position = ((num - 1) % wagon.seatsPerRow) + 1;
    seats.push({
      id: num,
      row,
      position,
      status: booked.has(num) ? "booked" : "available",
    });
  }
 
  return seats;
}
 