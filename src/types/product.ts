export type Product = {
  id: number;
  name: string;
  /** Price in naira. Format for display with `formatNaira`. */
  price: number;
  /** Store name, shown on cards. */
  vendor: string;
  /** Links the product to its vendor storefront. */
  vendorId: number;
  image: string;
};
