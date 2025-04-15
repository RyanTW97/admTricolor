const API_URL = "https://servidor-tricolor-64a23aa2b643.herokuapp.com/api";

export async function fetchCarouselItems() {
  const res = await fetch(
    "https://servidor-tricolor-64a23aa2b643.herokuapp.com/api/carousel-images?populate=Imagen",
    { cache: "no-store" }
  );

  const json = await res.json();
  return json.data;
}

export async function updateCarouselItem(id: number, data: FormData) {
  const res = await fetch(
    `https://servidor-tricolor-64a23aa2b643.herokuapp.com/api/carousel-images/${id}`,
    {
      method: "PUT",
      body: data,
    }
  );

  const json = await res.json();
  return json;
}
