export const getDueInDays = (
  dueDate: string | Date | null | undefined,
): string => {
  if (!dueDate) return "No due date";

  const today = new Date();

  let due: Date;
  if (dueDate instanceof Date) {
    due = new Date(dueDate.getTime());
  } else {
    due = new Date(String(dueDate));
  }

  if (isNaN(due.getTime())) return "No due date";

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / msPerDay);

  if (diffDays < 0) {
    const days = Math.abs(diffDays);
    return `${days} day${days === 1 ? "" : "s"} overdue`;
  }

  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";

  return `Due in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
};
