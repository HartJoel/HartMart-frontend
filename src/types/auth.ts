export type UserRole = "CUSTOMER" | "VENDOR" | "ADMIN";

export type UserAvatar = {
  url: string;
  publicId: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: UserAvatar | null;
  emailVerified?: boolean;
};

/** A row from the admin user directory (`GET /users`, `GET /users/:id`) — adds the account `status`. */
export type AdminUserSummary = AuthUser & { status: string };

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
  accessToken: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser;
};

export type RefreshResponse = {
  accessToken: string;
};
