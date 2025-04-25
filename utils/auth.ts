// utils/auth.ts

export const AUTORIZADOS: { email: string; password: string }[] = [
  { email: "briancueva97@gmail.com", password: "YwAXVmpFzqIy4Do" },
  {
    email: "administrador1@tricolorbyamerica.com",
    password: "02IU1UkNw3Wdf5X",
  },
  { email: "ventas2@tricolorbyamerica.com", password: "dhtNvjY3L4LeP8x" },
  { email: "ymedina@pinturasamerica.com", password: "2wdVy8SzYw1u2VD" },
  { email: "mabad@pinturasamerica.com", password: "9terh4fKDTMVz8r" },
];

export const getAuthMap = () => {
  const map: Record<string, string> = {};
  AUTORIZADOS.forEach(({ email, password }) => {
    map[email.toLowerCase()] = password;
  });
  return map;
};
