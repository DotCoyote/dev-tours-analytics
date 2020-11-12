export const today = new Date();
export const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

export const getDates = (start: Date, end: Date) => {
  const arr = [];
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  return arr;
};
