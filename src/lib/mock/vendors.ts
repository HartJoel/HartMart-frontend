import type { Vendor } from "@/types/vendor";

// Placeholder vendor list until GET /vendor and GET /vendor/:id are wired.
export const vendors: Vendor[] = [
  {
    id: 1,
    name: "Lagos Leather Co.",
    tagline: "Hand-finished pieces, made to last.",
    description:
      "Bags, belts and small leather goods, made by hand in Lagos from leather sourced from local tanneries. Every piece is finished and checked by the maker before it ships.",
    initials: "LL",
    category: "Fashion & Apparel",
    location: "Yaba, Lagos",
    verified: true,
    rating: 4.9,
    reviewCount: 88,
    joined: "2024-03-12",
  },
  {
    id: 2,
    name: "AjoTech Gadgets",
    tagline: "Smart tech for everyday living.",
    description:
      "Audio, wearables and smart home essentials for everyday Nigerian homes. Warranties and after-sales support are handled in-house.",
    initials: "AT",
    category: "Electronics",
    location: "Ikeja, Lagos",
    verified: true,
    rating: 4.7,
    reviewCount: 214,
    joined: "2023-11-02",
  },
  {
    id: 3,
    name: "Mama Bisi’s Kitchenware",
    tagline: "The heart of every Nigerian kitchen.",
    description:
      "Pots, pans and serving ware for everyday cooking, sourced from makers across Nigeria. Mama Bisi has been running her stall for more than twenty years.",
    initials: "MB",
    category: "Home & Living",
    location: "Mushin, Lagos",
    verified: true,
    rating: 4.8,
    reviewCount: 47,
    joined: "2024-06-20",
  },
  {
    id: 4,
    name: "Naija Glow Beauty",
    tagline: "Skincare made for melanin-rich skin.",
    description:
      "Skincare formulated for melanin-rich skin, with clean ingredients and routines built for Lagos heat and humidity.",
    initials: "NG",
    category: "Beauty",
    location: "Surulere, Lagos",
    verified: true,
    rating: 4.8,
    reviewCount: 132,
    joined: "2024-01-15",
  },
  {
    id: 5,
    name: "Owanbe Studio",
    tagline: "Celebration wear, stitched in Lagos.",
    description:
      "Occasion wear from ankara dresses to agbada sets, made to measure or in standard sizes.",
    initials: "OS",
    category: "Fashion & Apparel",
    location: "Ikoyi, Lagos",
    verified: true,
    rating: 4.6,
    reviewCount: 61,
    joined: "2024-08-02",
  },
  {
    id: 6,
    name: "Mainland Kicks",
    tagline: "Everyday sneakers for Lagos streets.",
    description: "Comfortable, durable sneakers for long days on the move.",
    initials: "MK",
    category: "Fashion & Apparel",
    location: "Yaba, Lagos",
    verified: true,
    rating: 4.5,
    reviewCount: 39,
    joined: "2025-02-10",
  },
  {
    id: 7,
    name: "Scent House Lagos",
    tagline: "Fragrances inspired by Lagos.",
    description: "Oud, citrus and floral perfume oils blended in small batches in Lagos.",
    initials: "SH",
    category: "Beauty",
    location: "Ikoyi, Lagos",
    verified: true,
    rating: 4.7,
    reviewCount: 73,
    joined: "2024-10-08",
  },
];

/** Vendors featured on the home page. */
export const topVendors = vendors.slice(0, 4);

export function findVendor(id: string | number | undefined) {
  return vendors.find((vendor) => vendor.id === Number(id));
}
