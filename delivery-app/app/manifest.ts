import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DeliveryPremium - Reuniones inolvidables, sabores insuperables",
    short_name: "DeliveryPremium",
    description: "Delivery de bebidas alcohólicas premium y tablas gourmet a domicilio",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#d97706",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["food", "shopping", "lifestyle"],
    lang: "es",
    orientation: "portrait-primary",
  }
}
