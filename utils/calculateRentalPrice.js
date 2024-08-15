/**
 * @description calculate rental price given 2 weeks price
 * @param {Date} dueDate
 * @param {number} twoWeeksPrice
 * @returns
 */
export default function calculateRentalPrice(dueDate, twoWeeksPrice) {
  const currentDate = new Date();

  // Calculate the difference in time (in milliseconds)
  const differenceInTime = dueDate.getTime() - currentDate.getTime();

  // Convert the time difference into days (milliseconds per day)
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil(differenceInTime / millisecondsPerDay);

  const pricePerDay = twoWeeksPrice / 14;

  const totalPrice = days * pricePerDay;

  return totalPrice.toFixed(2);
}
