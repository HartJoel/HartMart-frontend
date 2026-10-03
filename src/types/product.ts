export type Product = {
  id: number;
  name: string;
  /** Price in naira. Format for display with `formatNaira`. */
  price: number;
  vendor: string;
  image: string;
};
