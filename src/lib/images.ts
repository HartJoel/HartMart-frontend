/**
 * Product images have been seen in two shapes from the API/seed data:
 * the current `{ url, publicId }` object, and a plain URL string from
 * older seeds. Accept either so rendering doesn't depend on which one
 * produced a given record.
 */
export type ProductImage = { url: string; publicId?: string } | string;

export function imageUrl(image: ProductImage | undefined | null): string | undefined {
  if (!image) return undefined;
  return typeof image === "string" ? image : image.url;
}

export function firstImageUrl(images: ProductImage[] | undefined | null): string | undefined {
  return imageUrl(images?.[0]);
}
