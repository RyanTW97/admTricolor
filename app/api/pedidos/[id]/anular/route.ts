// app/api/pedidos/[id]/anular/route.ts

import { NextResponse } from "next/server";

// Usamos los nombres de variables de entorno que tienes en tu .env.local
const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const DATAFAST_URL = process.env.DATAFAST_URL;
const DATAFAST_ENTITY_ID = process.env.DATAFAST_ENTITY_ID;
const DATAFAST_BEARER_TOKEN = process.env.DATAFAST_BEARER_TOKEN;

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: pedidoId } = params;

  // Verificamos que todas las variables existan
  if (
    !STRAPI_URL ||
    !STRAPI_TOKEN ||
    !DATAFAST_URL ||
    !DATAFAST_ENTITY_ID ||
    !DATAFAST_BEARER_TOKEN
  ) {
    console.error(
      "❌ [API Anular] Error: Faltan variables de entorno críticas. Revisa tu archivo .env.local"
    );
    return NextResponse.json(
      { error: "Configuración del servidor incompleta." },
      { status: 500 }
    );
  }

  try {
    const strapiResponse = await fetch(
      `${STRAPI_URL}/api/orders/${pedidoId}?populate=*`,
      {
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
        cache: "no-store",
      }
    );

    if (!strapiResponse.ok) {
      return NextResponse.json(
        { error: `Pedido #${pedidoId} no encontrado.` },
        { status: 404 }
      );
    }

    const { data: pedido } = await strapiResponse.json();
    const { totalAmount, datafastTransactionId, status, datafastResponse } =
      pedido.attributes;
    const tipoCreditoOriginal =
      datafastResponse?.customParameters?.SHOPPER_TIPOCREDITO;

    // Esta validación previene el error 'cannot refund'
    if (status === "annulled") {
      return NextResponse.json(
        { error: `El pedido #${pedidoId} ya ha sido anulado previamente.` },
        { status: 400 }
      );
    }
    if (status === "delivered" || status === "failed") {
      return NextResponse.json(
        { error: `El pedido con estado "${status}" no puede ser anulado.` },
        { status: 400 }
      );
    }
    if (!datafastTransactionId) {
      return NextResponse.json(
        {
          error:
            "El pedido no tiene un ID de transacción de Datafast asociado.",
        },
        { status: 400 }
      );
    }

    const datafastPayload = new URLSearchParams({
      entityId: DATAFAST_ENTITY_ID,
      amount: totalAmount.toFixed(2),
      currency: "USD",
      paymentType: "RF",
    });

    datafastPayload.append("testMode", "EXTERNAL");

    if (tipoCreditoOriginal) {
      datafastPayload.append(
        "customParameters[SHOPPER_TIPOCREDITO]",
        tipoCreditoOriginal
      );
    }

    const datafastAnulacionResponse = await fetch(
      `${DATAFAST_URL}/v1/payments/${datafastTransactionId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DATAFAST_BEARER_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: datafastPayload.toString(),
      }
    );

    const datafastResult = await datafastAnulacionResponse.json();
    console.log(
      "✅ RESPUESTA JSON DE ANULACIÓN DE DATAFAST:",
      JSON.stringify(datafastResult, null, 2)
    );

    const resultCode = datafastResult.result?.code;
    const isSuccess = resultCode && /^(000\.000|000\.100)/.test(resultCode);

    if (!isSuccess) {
      const errorDescription =
        datafastResult.result?.description || "Error desconocido.";
      return NextResponse.json(
        { error: `Datafast rechazó la anulación: ${errorDescription}` },
        { status: 400 }
      );
    }

    await fetch(`${STRAPI_URL}/api/orders/${pedidoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({ data: { status: "annulled" } }),
    });

    return NextResponse.json({
      message: `Pedido #${pedidoId} anulado correctamente.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Ocurrió un error interno en el servidor." },
      { status: 500 }
    );
  }
}
