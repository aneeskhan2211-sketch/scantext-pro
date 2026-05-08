import { t as toDate, c as constructFrom, a as constructNow } from "./formatDistanceToNow-BI0ppbMU.js";
function addDays(date, amount) {
  const _date = toDate(date);
  if (isNaN(amount)) return constructFrom(date, NaN);
  _date.setDate(_date.getDate() + amount);
  return _date;
}
function startOfDay(date) {
  const _date = toDate(date);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
function isSameDay(dateLeft, dateRight) {
  const dateLeftStartOfDay = startOfDay(dateLeft);
  const dateRightStartOfDay = startOfDay(dateRight);
  return +dateLeftStartOfDay === +dateRightStartOfDay;
}
function isToday(date) {
  return isSameDay(date, constructNow(date));
}
function subDays(date, amount) {
  return addDays(date, -1);
}
function isYesterday(date) {
  return isSameDay(date, subDays(constructNow(date)));
}
export {
  isYesterday as a,
  isToday as i
};
