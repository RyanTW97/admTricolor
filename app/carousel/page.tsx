"use client";

import { useEffect, useState } from "react";
import { fetchCarouselItems } from "@/lib/fetchCarousel";
import { CarouselCardEditable } from "@/components/CarouselCardEditable";
import { useRutaProtegida } from "@/lib/protegerRuta";

export default function CarouselPage() {
  useRutaProtegida(); // ⛔ Protege esta página al cargarla

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const cargar = async () => {
      const data = await fetchCarouselItems();
      const result = Array.from(
        { length: 4 },
        (_, i) => data[i] || { id: i + 1 }
      );
      setItems(result);
    };

    cargar();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Gestión del Carousel</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((item) => {
          const attr = item.attributes || {};
          const imageUrl = attr.Imagen?.data?.attributes?.url || "";

          return (
            <CarouselCardEditable
              key={item.id}
              id={item.id}
              defaultValues={
                attr.Nombre
                  ? {
                      nombre: attr.Nombre,
                      slug: attr.slug,
                      link: attr.Link,
                      imageUrl,
                    }
                  : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
}
