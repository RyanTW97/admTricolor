"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchDashboardData,
  fetchActiveProductsCount,
} from "@/lib/fetchDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRutaProtegida } from "@/lib/protegerRuta";

export default function Home() {
  useRutaProtegida(); // 🚨 Protección global al cargar la página

  const [pedidosNuevos, setPedidosNuevos] = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [ventas, setVentas] = useState(0);
  const [productos, setProductos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const dashboard = await fetchDashboardData();
      const productosActivos = await fetchActiveProductsCount();

      setPedidosNuevos(dashboard.pedidosNuevos);
      setPendientes(dashboard.pendientes);
      setVentas(dashboard.ventas);
      setProductos(productosActivos);
      setLoading(false);
    };

    cargar();
  }, []);

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bienvenido a Tricolor</h1>
        <p className="text-muted-foreground">Panel administrativo</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/pedidos">
          <Card className="hover:shadow-md transition">
            <CardHeader>
              <CardTitle>Pedidos nuevos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pedidosNuevos}</p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendientes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ventas 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${ventas.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{productos}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
