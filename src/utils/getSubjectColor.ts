import { routine } from "@/data/routine";

export const getSubjectColor = (id: number): string => {
  for (const day of Object.values(routine)) {
    const item = day.find((subject) => subject.id === id);

    if (item) {
      return item.color;
    }
  }

  // default color if not found
  return "#6B7280"; 
};
