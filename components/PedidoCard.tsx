"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Producto {
  name: string;
  color?: string;
  price: number;
  quantity: number;
  presentation: string;
}

interface Factura {
  pais: string;
  ciudad: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  provincia: string;
  referencia: string;
  identificacionTipo: string;
  identificacionNumero: string;
}

interface PedidoProps {
  id: number;
  status: string;
  totalAmount: number;
  fechaPedido: string;
  cliente: string;
  ciudad: string;
  nota?: string | null;
  productos: Producto[];
  trackingNumber?: string | null;
  deliveryDate?: string | null;
  factura?: Factura;
  onGuardar?: (id: number, data: any) => Promise<any>;
  onRefetch?: () => void;
  nuevo?: boolean; // ✅ nueva prop
}

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  processing: "En proceso de envío",
  delivered: "Entregado",
  failed: "Fallido",
};

const statusStyles: Record<string, string> = {
  pending: "border-yellow-400 text-yellow-600",
  paid: "border-green-500 text-green-600",
  processing: "border-blue-500 text-blue-600",
  delivered: "border-emerald-500 text-emerald-600",
  failed: "border-red-500 text-red-600",
};

export function PedidoCard({
  id,
  status,
  totalAmount,
  fechaPedido,
  cliente,
  ciudad,
  nota,
  productos,
  trackingNumber,
  deliveryDate,
  factura,
  onGuardar,
  onRefetch,
  nuevo,
}: PedidoProps) {
  const [expanded, setExpanded] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [tracking, setTracking] = useState(trackingNumber || "");
  const [delivery, setDelivery] = useState(deliveryDate || "");
  const [note, setNote] = useState(nota || "");
  const [saving, setSaving] = useState(false);

  const handleGuardar = async () => {
    try {
      setSaving(true);

      await onGuardar?.(id, {
        status: currentStatus,
        trackingNumber: tracking || null,
        deliveryDate: delivery || null,
        admNote: note || null,
      });

      toast.success(`Pedido #${id} actualizado correctamente`);
      onRefetch?.();
    } catch (error) {
      toast.error(`Error al guardar el pedido #${id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Pedido #{id}
            {nuevo && (
              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                Nuevo pedido
              </span>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {cliente} – {ciudad}
          </p>
          <p className="text-sm text-muted-foreground">{fechaPedido}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Select value={currentStatus} onValueChange={setCurrentStatus}>
            <SelectTrigger
              className={cn(
                "w-[180px] border transition-colors duration-300 capitalize",
                statusStyles[currentStatus]
              )}
            >
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm font-medium">${totalAmount.toFixed(2)}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium">Productos:</p>
            <ul className="pl-4 list-disc text-sm text-muted-foreground">
              {productos.map((item, index) => (
                <li key={index}>
                  {item.quantity} x {item.name} ({item.presentation}) – $
                  {item.price}
                  {item.color && (
                    <>
                      {" "}
                      – <span className="italic">{item.color}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {factura && (
            <div>
              <p className="font-medium">Datos de factura:</p>
              <ul className="pl-4 list-disc text-sm text-muted-foreground">
                <li>
                  Nombre: {factura.nombre} {factura.apellido}
                </li>
                <li>Teléfono: {factura.telefono}</li>
                <li>
                  Dirección: {factura.direccion}, {factura.ciudad},{" "}
                  {factura.provincia}
                </li>
                <li>Referencia: {factura.referencia}</li>
                <li>
                  Identificación: {factura.identificacionTipo} –{" "}
                  {factura.identificacionNumero}
                </li>
              </ul>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="font-medium mb-1">Tracking:</p>
              <Input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="Ej: TRK12345678"
              />
            </div>

            <div>
              <p className="font-medium mb-1">Fecha de entrega:</p>
              <Input
                type="date"
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="font-medium mb-1">Nota del admin:</p>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Agrega una nota interna..."
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleGuardar}
              className="mt-2 gap-2"
              disabled={saving}
            >
              <Save size={16} />
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
