export type Address = {
  id: string;
  userId: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddressInput = {
  addressLine: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
};
