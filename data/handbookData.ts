import {
  volumeOneProductData,
  volumeTwoProductData,
} from "@/data/productData";

export const handbookVolumes = [
  {
    id: "volume-1",
    volume: "Volume 1",
    title: volumeOneProductData.title,
    description:
      "A professional methodology for responsible, traceable and decision-focused AI-assisted Solar PV and BESS project development.",
    status: "Checkout temporarily paused",
    pages: volumeOneProductData.pages,
    chapters: volumeOneProductData.chapters,
    edition: volumeOneProductData.edition,
    price: volumeOneProductData.price,
    cover: "/volume-1-cover.webp",
    href: "/solar-bess-project-development-handbook",
    cta: "Explore Volume 1",
    available: false,
  },
  {
    id: "volume-2",
    volume: "Volume 2",
    title: volumeTwoProductData.title,
    description:
      "A professional methodology spanning FEED, grid connection, consenting, procurement, financing, construction, commissioning, operations and portfolio strategy.",
    status: "Checkout temporarily paused",
    pages: volumeTwoProductData.pages,
    chapters: volumeTwoProductData.chapters,
    edition: volumeTwoProductData.edition,
    price: volumeTwoProductData.price,
    cover: "/volume-2-cover.webp",
    href: "/solar-bess-project-development-handbook-volume-2",
    cta: "Explore Volume 2",
    available: false,
  },
] as const;
