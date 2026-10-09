export type ReviewAuthor = {
  id: string;
  name: string;
};

/**
 * `GET /reviews/:productId`, `POST /reviews`, `PATCH /reviews/:id`, `POST /reviews/:id/response`
 * — confirmed from live responses. `user` is only confirmed present on the create response; treat
 * it as possibly missing elsewhere.
 */
export type Review = {
  id: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  comment: string;
  vendorResponse: string | null;
  vendorResponseAt: string | null;
  helpful: number;
  isVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: ReviewAuthor;
};

/** What the shopper submits from the review form. */
export type ReviewInput = {
  rating: number;
  comment: string;
};

/** Body for `POST /reviews` — `ReviewInput` plus what it's attached to. */
export type CreateReviewInput = ReviewInput & {
  productId: string;
  orderId: string;
};
