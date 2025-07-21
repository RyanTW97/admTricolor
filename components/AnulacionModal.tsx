// components/AnulacionModal.tsx (NUEVO ARCHIVO)
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AnulacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pedidoId: number;
  totalAmount: number;
  isConfirming: boolean;
}

export function AnulacionModal({
  isOpen,
  onClose,
  onConfirm,
  pedidoId,
  totalAmount,
  isConfirming,
}: AnulacionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Anular Pedido #{pedidoId}</DialogTitle>
          <DialogDescription>
            Sigue estos pasos para anular la transacción de forma segura.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <p className="font-bold">Paso 1: Anular en el Portal de Datafast</p>
            <p>
              Busca la transacción en el portal administrativo de Datafast con
              la siguiente información:
            </p>
            <ul className="mt-2 list-disc pl-5">
              <li>
                <strong>ID de Transacción:</strong> {pedidoId}
              </li>
              <li>
                <strong>Monto a anular:</strong> ${totalAmount.toFixed(2)}
              </li>
            </ul>
          </div>
          <div>
            <p className="font-bold">
              Paso 2: Confirmar Anulación en este Panel
            </p>
            <p className="text-sm text-muted-foreground">
              Una vez que hayas anulado la transacción en el portal de Datafast,
              presiona el botón de confirmar para actualizar el estado del
              pedido en este sistema.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isConfirming}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? "Confirmando..." : "Confirmar Anulación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
