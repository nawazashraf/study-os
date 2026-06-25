export function getCurrentWeek() {
  const today = new Date();

  const monday = new Date(today);

  const day = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  const diff = day === 0 ? -6 : 1 - day;

  monday.setDate(today.getDate() + diff);

  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    return {
      date,
      dayName: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      dayNumber: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
    };
  });
}
