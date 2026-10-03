export type Notification = {
  id: number;
  title: string;
  body: string;
  /** ISO timestamp. */
  createdAt: string;
  read: boolean;
};
