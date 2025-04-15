// utils/auth.ts

export const AUTORIZADOS: { email: string; password: string }[] = [
  { email: "briancueva97@gmail.com", password: "tricolor123" },
  { email: "admin@tricolor.com", password: "admin2024" },
  { email: "ventas@tutienda.com", password: "ventasSegura" },
  { email: "equipo@logistica.com", password: "logistica456" },
  { email: "supervisor@tricolor.com", password: "supervisor789" },
  { email: "jefe@empresa.com", password: "jefazo321" },
];

export const getAuthMap = () => {
  const map: Record<string, string> = {};
  AUTORIZADOS.forEach(({ email, password }) => {
    map[email.toLowerCase()] = password;
  });
  return map;
};
