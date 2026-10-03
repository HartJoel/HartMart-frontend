export type Review = {
  id: number;
  author: string;
  /** Whole stars, 1 to 5. */
  rating: number;
  title: string;
  body: string;
  /** ISO date string. */
  date: string;
  verified: boolean;
};

/** What the shopper submits from the review form. */
export type ReviewInput = {
  rating: number;
  title: string;
  body: string;
};

export type ReviewSummary = {
  /** Average rating out of 5. */
  average: number;
  count: number;
  /** Number of reviews per star level. */
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};
