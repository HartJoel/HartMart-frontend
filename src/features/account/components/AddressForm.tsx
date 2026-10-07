import { useState, type FormEvent } from "react";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import type { AddressInput } from "@/types/address";

type AddressField = Exclude<keyof AddressInput, "isDefault">;

type AddressFormProps = {
  initial?: AddressInput;
  onSubmit: (value: AddressInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

const emptyAddress: AddressInput = {
  addressLine: "",
  city: "",
  state: "",
  country: "Nigeria",
  zipCode: "",
  isDefault: false,
};

function validate(values: AddressInput): Partial<Record<AddressField, string>> {
  const errors: Partial<Record<AddressField, string>> = {};

  if (values.addressLine.trim().length < 5) errors.addressLine = "Enter the street address.";
  if (!values.city.trim()) errors.city = "Enter the city.";
  if (!values.state.trim()) errors.state = "Enter the state.";
  if (!values.country.trim()) errors.country = "Enter the country.";
  if (!/^[A-Za-z0-9\s-]{3,10}$/.test(values.zipCode.trim())) errors.zipCode = "Enter a valid zip/postal code.";

  return errors;
}

/** Add or edit an address. Errors show once a field has been left, and Save stays disabled until the form is valid. */
export default function AddressForm({ initial = emptyAddress, onSubmit, onCancel, isSubmitting }: AddressFormProps) {
  const [values, setValues] = useState<AddressInput>(initial);
  const [touched, setTouched] = useState<Partial<Record<AddressField, boolean>>>({});

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  function setField(field: AddressField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function touch(field: AddressField) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function errorFor(field: AddressField) {
    return touched[field] ? errors[field] : undefined;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched({
      addressLine: true,
      city: true,
      state: true,
      country: true,
      zipCode: true,
    });
    if (!isValid) return;

    onSubmit({
      addressLine: values.addressLine.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
      country: values.country.trim(),
      zipCode: values.zipCode.trim(),
      isDefault: values.isDefault,
    });
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-5">
      <TextField
        label="Street address"
        autoComplete="street-address"
        value={values.addressLine}
        onChange={(event) => setField("addressLine", event.target.value)}
        onBlur={() => touch("addressLine")}
        error={errorFor("addressLine")}
      />

      <div className="grid grid-cols-2 gap-4 max-[480px]:grid-cols-1">
        <TextField
          label="City"
          autoComplete="address-level2"
          value={values.city}
          onChange={(event) => setField("city", event.target.value)}
          onBlur={() => touch("city")}
          error={errorFor("city")}
        />
        <TextField
          label="State"
          autoComplete="address-level1"
          value={values.state}
          onChange={(event) => setField("state", event.target.value)}
          onBlur={() => touch("state")}
          error={errorFor("state")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 max-[480px]:grid-cols-1">
        <TextField
          label="Country"
          autoComplete="country-name"
          value={values.country}
          onChange={(event) => setField("country", event.target.value)}
          onBlur={() => touch("country")}
          error={errorFor("country")}
        />
        <TextField
          label="Zip / postal code"
          autoComplete="postal-code"
          value={values.zipCode}
          onChange={(event) => setField("zipCode", event.target.value)}
          onBlur={() => touch("zipCode")}
          error={errorFor("zipCode")}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-[13px] font-[600]">
        <input
          type="checkbox"
          checked={values.isDefault}
          onChange={(event) => setValues((current) => ({ ...current, isDefault: event.target.checked }))}
          className="size-4 accent-hm-text"
        />
        Make this my default address
      </label>

      <div className="mt-2 flex justify-end gap-3 max-[480px]:flex-col-reverse">
        <Button variant="quiet" size="sm" onClick={onCancel} className="max-[480px]:w-full">
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={!isValid || isSubmitting} className="max-[480px]:w-full">
          {isSubmitting ? "Saving…" : "Save address"}
        </Button>
      </div>
    </form>
  );
}
