// @ts-nocheck
//app/pedidos/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { PedidoCard } from "@/components/PedidoCard";
import { fetchPedidos, patchPedido } from "@/lib/fetchPedidos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRutaProtegida } from "@/lib/protegerRuta";

const statusLabels: Record<string, string> = {
  all: "Activos",
  pending: "Pendientes",
  paid: "Pagados",
  processing: "En envío",
  delivered: "Entregados",
  failed: "Fallidos",
  annulled: "Anulados",
};

export default function PedidosPage() {
  useRutaProtegida();

  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<keyof typeof statusLabels>("all");
  const [search, setSearch] = useState("");
  const [nuevosIds, setNuevosIds] = useState<number[]>([]);

  const refetch = async () => {
    try {
      const data = await fetchPedidos();

      if (!Array.isArray(data)) {
        console.error(
          "La respuesta de la API no es un array. Se establecerá una lista vacía."
        );
        setPedidos([]);
        return;
      }

      const nuevos = data
        .filter((p: any) => p.attributes.status !== "processing")
        .map((p: any) => p.id);

      const guardados = JSON.parse(
        localStorage.getItem("nuevos-pedidos") || "[]"
      );
      const combinados = Array.from(new Set([...guardados, ...nuevos]));

      localStorage.setItem("nuevos-pedidos", JSON.stringify(combinados));
      setNuevosIds(combinados);

      setPedidos(data);
    } catch (error) {
      console.error("Error crítico durante la carga de pedidos:", error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  const handleStatusUpdate = (id: number, newStatus: string) => {
    if (newStatus === "processing") {
      const actualizados = nuevosIds.filter((pid) => pid !== id);
      localStorage.setItem("nuevos-pedidos", JSON.stringify(actualizados));
      setNuevosIds(actualizados);
    }
  };

  const pedidosFiltrados = useMemo(() => {
    if (!pedidos || pedidos.length === 0) {
      return [];
    }

    const filtrados =
      filtro === "all"
        ? pedidos.filter(
            (p) =>
              p.attributes.status !== "delivered" &&
              p.attributes.status !== "annulled"
          )
        : pedidos.filter((p) => p.attributes.status === filtro);

    const buscados = filtrados.filter((pedido) => {
      const idMatch = pedido.id.toString().includes(search.trim());
      const user = pedido.attributes.users_permissions_user?.data?.attributes;
      const username = user?.username?.toLowerCase() || "";
      const nombreMatch = username.includes(search.trim().toLowerCase());
      return idMatch || nombreMatch;
    });

    return buscados.sort((a, b) => {
      const esNuevoA = nuevosIds.includes(a.id);
      const esNuevoB = nuevosIds.includes(b.id);
      if (esNuevoA && !esNuevoB) return -1;
      if (!esNuevoA && esNuevoB) return 1;
      return (
        new Date(b.attributes.createdAt).getTime() -
        new Date(a.attributes.createdAt).getTime()
      );
    });
  }, [pedidos, filtro, search, nuevosIds]);

  const resumen = useMemo(() => {
    const total = pedidos.length;
    const totalAmount = pedidos.reduce(
      (acc, p) => acc + (p.attributes.totalAmount || 0),
      0
    );
    const estados: Record<string, number> = {
      pending: 0,
      paid: 0,
      processing: 0,
      delivered: 0,
      failed: 0,
      annulled: 0,
    };

    pedidos.forEach((p) => {
      const estado = p.attributes.status;
      if (estados[estado] !== undefined) estados[estado]++;
    });

    return { total, totalAmount, estados };
  }, [pedidos]);

  if (loading) return <p className="p-4">Cargando pedidos...</p>;

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">Pedidos</h1>
        {nuevosIds.length > 0 && (
          <div className="flex items-center gap-2 text-sm font-medium text-red-600 mb-2">
            <span className="animate-pulse">🔔</span>
            <span>
              {nuevosIds.length} nuevo{nuevosIds.length > 1 ? "s" : ""} pedido
              {nuevosIds.length > 1 ? "s" : ""}
            </span>
          </div>
        )}
        <div className="text-sm text-muted-foreground grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="font-medium">Total de pedidos:</p>
            <span>{resumen.total}</span>
          </div>
          <div>
            <p className="font-medium">Total vendido:</p>
            <span>${resumen.totalAmount.toFixed(2)}</span>
          </div>
          <div>
            <p className="font-medium">Pendientes:</p>
            <span>{resumen.estados.pending}</span>
          </div>
          <div>
            <p className="font-medium">Entregados:</p>
            <span>{resumen.estados.delivered}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={filtro === key ? "default" : "outline"}
              onClick={() => setFiltro(key as keyof typeof statusLabels)}
            >
              {label}
            </Button>
          ))}
        </div>
        <Input
          type="text"
          placeholder="Buscar por usuario o número de pedido..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:max-w-sm"
        />
      </div>
      <div className="space-y-4">
        {pedidosFiltrados.length > 0 ? (
          pedidosFiltrados.map((pedido) => {
            const attr = pedido.attributes;
            const user = attr.users_permissions_user?.data?.attributes;
            const factura = attr.items?.facturaData;
            const productos = attr.items?.cartItems;

            if (!productos) {
              console.error(
                `El pedido #${pedido.id} no tiene 'cartItems' y se omite.`
              );
              return null;
            }
            const esNuevo = nuevosIds.includes(pedido.id);
            return (
              <PedidoCard
                key={pedido.id}
                metodoEnvio={attr.metodoEnvio}
                id={pedido.id}
                status={attr.status}
                totalAmount={attr.totalAmount}
                fechaPedido={attr.fechaPedido}
                cliente={`${user?.username || "Usuario Desconocido"}`}
                ciudad={factura?.ciudad || "Ciudad no especificada"}
                nota={attr.admNote}
                productos={productos}
                factura={factura}
                trackingNumber={attr.trackingNumber}
                deliveryDate={attr.deliveryDate}
                fechaEnvio={attr.fechaEnvio}
                onGuardar={async (id, data) => {
                  await patchPedido(id, data);
                  handleStatusUpdate(id, data.status);
                  refetch();
                }}
                onRefetch={refetch}
                nuevo={esNuevo}
              />
            );
          })
        ) : (
          <p className="text-center text-muted-foreground p-8">
            No se encontraron pedidos para el filtro seleccionado.
          </p>
        )}
      </div>
    </div>
  );
}
