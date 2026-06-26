import { routine } from "@/data/routine";

export const getSubjectName = (id: number) => {
  for (const day of Object.values(routine)) {
    const item = day.find((subject) => subject.id === id);

    if (item) {
      return item.subject;
    }
  }

  return null;
};
