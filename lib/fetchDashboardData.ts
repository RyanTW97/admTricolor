export async function fetchDashboardData() {
  const res = await fetch(
    "https://servidor-tricolor-64a23aa2b643.herokuapp.com/api/orders",
    { cache: "no-store" }
  );
  const json = await res.json();
  const orders = json.data;

  const pedidosNuevos = orders.filter(
    (o: any) => o.attributes.status !== "processing"
  );

  const pendientes = orders.filter((o: any) =>
    ["pending", "paid"].includes(o.attributes.status)
  );

  const ventas2025 = orders
    .filter((o: any) => o.attributes.fechaPedido?.startsWith("2025"))
    .reduce((acc: number, o: any) => acc + (o.attributes.totalAmount || 0), 0);

  return {
    pedidosNuevos: pedidosNuevos.length,
    pendientes: pendientes.length,
    ventas: ventas2025,
  };
}

export async function fetchActiveProductsCount() {
  const res = await fetch(
    "https://servidor-tricolor-64a23aa2b643.herokuapp.com/api/products?pagination[pageSize]=1",
    { cache: "no-store" }
  );
  const json = await res.json();
  return json.meta.pagination.total;
}
