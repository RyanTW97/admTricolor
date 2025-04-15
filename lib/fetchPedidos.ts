// lib/api.ts

export async function fetchPedidos() {
  const res = await fetch(
    "https://servidor-tricolor-64a23aa2b643.herokuapp.com/api/orders",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // fuerza recarga en cada request
    }
  );

  if (!res.ok) throw new Error("Error al obtener pedidos");

  const json = await res.json();
  return json.data;
}

export async function patchPedido(id: number, data: any) {
  const res = await fetch(
    `https://servidor-tricolor-64a23aa2b643.herokuapp.com/api/orders/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    }
  );

  if (!res.ok) {
    throw new Error("Error al actualizar pedido");
  }

  return await res.json();
}
