export type Address = {
  id: number;
  /** Short name the shopper gives the address, such as "Home". */
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  isDefault: boolean;
};

export type AddressInput = Omit<Address, "id">;
