export const dateFormatter = (date) => {
  const tempDate = new Date(date);
  const newDate = tempDate.toLocaleDateString();
  return newDate;
};
