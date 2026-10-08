export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  /** The id of this category's parent, or null for a top-level category. */
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  /** Present only on `GET /category/:id`, not on the list endpoint. */
  subCategories?: Category[];
};
