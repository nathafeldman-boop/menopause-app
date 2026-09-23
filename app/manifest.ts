import type { MetadataRoute } from "next";

import { APP_NAME, APP_TAGLINE } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${APP_NAME} — Coach alimentaire ménopause`,
    short_name: APP_NAME,
    description: APP_TAGLINE,
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#fdf1f4",
    theme_color: "#fdf1f4",
    lang: "fr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
