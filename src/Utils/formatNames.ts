export const formatNames = (name: string, surname: string) => {
  const cleanName = name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const cleanSurname = surname
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return `${cleanSurname} ${cleanName}`;
};