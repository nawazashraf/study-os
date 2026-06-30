export const cleanFileName = (name: string) =>
  name
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]/g, " ")
    .trim();
