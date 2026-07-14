import { checkIns } from '../data/CheckIn';

export function updateCheckOut(checkInId) {
  const checkIn = checkIns.find((item) => item.id === checkInId);

  if (checkIn) {
    checkIn.checkOutTime = new Date();
  }
}
