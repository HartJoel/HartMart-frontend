import { useState, type FormEvent } from "react";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import type { AddressInput } from "@/types/address";

type AddressField = Exclude<keyof AddressInput, "isDefault">;

type AddressFormProps = {
  initial?: AddressInput;
  onSubmit: (value: AddressInput) => void;
  onCancel: () => void;
};

const emptyAddress: AddressInput = {
  label: "",
  fullName: "",
  phone: "",
  line1: "",
  city: "",
  state: "",
  isDefault: false,
};

function validate(values: AddressInput): Partial<Record<AddressField, string>> {
  const errors: Partial<Record<AddressField, string>> = {};
  const phoneDigits = values.phone.replace(/\D/g, "").length;

  if (!values.label.trim()) errors.label = "Name this address, for example Home.";
  if (values.fullName.trim().length < 2) errors.fullName = "Enter the recipient's full name.";
  if (!/^\+?[\d\s-]+$/.test(values.phone.trim()) || phoneDigits < 10) {
    errors.phone = "Enter a phone number with at least 10 digits.";
  }
  if (values.line1.trim().length < 5) errors.line1 = "Enter the street address.";
  if (!values.city.trim()) errors.city = "Enter the city.";
  if (!values.state.trim()) errors.state = "Enter the state.";

  return errors;
}

/** Add or edit an address. Errors show once a field has been left, and Save stays disabled until the form is valid. */
export default function AddressForm({ initial = emptyAddress, onSubmit, onCancel }: AddressFormProps) {
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
      label: true,
      fullName: true,
      phone: true,
      line1: true,
      city: true,
      state: true,
    });
    if (!isValid) return;

    onSubmit({
      label: values.label.trim(),
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      line1: values.line1.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
      isDefault: values.isDefault,
    });
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid grid-cols-2 gap-4 max-[480px]:grid-cols-1">
        <TextField
          label="Address name"
          placeholder="Home, Office"
          value={values.label}
          onChange={(event) => setField("label", event.target.value)}
          onBlur={() => touch("label")}
          error={errorFor("label")}
        />
        <TextField
          label="Recipient name"
          autoComplete="name"
          value={values.fullName}
          onChange={(event) => setField("fullName", event.target.value)}
          onBlur={() => touch("fullName")}
          error={errorFor("fullName")}
        />
      </div>

      <TextField
        label="Phone number"
        type="tel"
        autoComplete="tel"
        placeholder="+234 803 000 0000"
        value={values.phone}
        onChange={(event) => setField("phone", event.target.value)}
        onBlur={() => touch("phone")}
        error={errorFor("phone")}
      />

      <TextField
        label="Street address"
        autoComplete="street-address"
        value={values.line1}
        onChange={(event) => setField("line1", event.target.value)}
        onBlur={() => touch("line1")}
        error={errorFor("line1")}
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
        <Button type="submit" size="sm" disabled={!isValid} className="max-[480px]:w-full">
          Save address
        </Button>
      </div>
    </form>
  );
}
