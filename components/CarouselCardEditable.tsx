"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateCarouselItem } from "@/lib/fetchCarousel";

interface CarouselCardEditableProps {
  id: number;
  defaultValues?: {
    nombre: string;
    slug: string;
    link: string;
    imageUrl: string;
  };
}

export function CarouselCardEditable({
  id,
  defaultValues,
}: CarouselCardEditableProps) {
  const [nombre, setNombre] = useState(defaultValues?.nombre || "");
  const [slug, setSlug] = useState(defaultValues?.slug || "");
  const [link, setLink] = useState(defaultValues?.link || "");
  const [imagePreview, setImagePreview] = useState(
    defaultValues?.imageUrl || ""
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [errors, setErrors] = useState({
    nombre: false,
    slug: false,
    link: false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGuardar = async () => {
    const hasErrors = {
      nombre: nombre.trim() === "",
      slug: slug.trim() === "",
      link: link.trim() === "",
    };

    setErrors(hasErrors);

    if (Object.values(hasErrors).some(Boolean)) {
      toast.error("Completa todos los campos antes de guardar");
      return;
    }

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        Nombre: nombre,
        slug,
        Link: link,
      })
    );

    if (imageFile) {
      formData.append("files.Imagen", imageFile); // ✅ campo correcto para Strapi
    }

    try {
      await updateCarouselItem(id, formData);
      toast.success(`Imagen #${id} actualizada correctamente ✅`);
    } catch (err) {
      toast.error("Error al guardar la imagen ❌");
      console.error(err);
    }
  };

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Imagen #{id}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm mb-1">Nombre</Label>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Duracryl"
            className={errors.nombre ? "border-red-500" : ""}
          />
        </div>

        <div>
          <Label className="text-sm mb-1">Slug</Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Ej: duracryl"
            className={errors.slug ? "border-red-500" : ""}
          />
        </div>

        <div>
          <Label className="text-sm mb-1">Link</Label>
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            className={errors.link ? "border-red-500" : ""}
          />
        </div>

        <div>
          <Label className="text-sm mb-1">Imagen</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          <img
            src={
              imagePreview ||
              "https://via.placeholder.com/600x300?text=Sin+imagen"
            }
            alt="Preview"
            className="mt-2 rounded-md border object-cover w-full h-40"
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button onClick={handleGuardar} className="gap-2">
          <Save size={16} /> Guardar cambios
        </Button>
      </CardFooter>
    </Card>
  );
}
