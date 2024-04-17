export const compareDates = (date1: Date, date2: Date) => {
  if (date1.getTime() <= date2.getTime()) {
    return true;
  } else {
    return false;
  }
};

console.log(compareDates(new Date(), new Date("2024-04-12T03:14:14.657Z")));
