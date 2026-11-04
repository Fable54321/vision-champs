export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function getCurrentWeekCode() {
  const today = new Date();
  const date = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );
  const dayOfWeek = date.getUTCDay() || 7;

  date.setUTCDate(date.getUTCDate() + 4 - dayOfWeek);

  const firstDayOfWeekYear = new Date(
    Date.UTC(date.getUTCFullYear(), 0, 1),
  );
  const elapsedDays =
    (date.getTime() - firstDayOfWeekYear.getTime()) / 86_400_000 + 1;
  const week = Math.ceil(elapsedDays / 7);

  return String(week).padStart(2, "0");
}

export function getCurrentDayCode() {
  const day = new Date().getDay();

  return String(day === 0 ? 7 : day);
}
