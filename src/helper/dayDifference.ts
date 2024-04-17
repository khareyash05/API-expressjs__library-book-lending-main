export const dayDifference = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

console.log(dayDifference(new Date(), new Date("2024-04-12T03:14:14.657Z")));
