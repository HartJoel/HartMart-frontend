import { useState } from "react";
import { Link } from "react-router";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button, { buttonClasses } from "@/components/Button";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import AccountShell from "@/features/account/components/AccountShell";
import AddressCard from "@/features/account/components/AddressCard";
import AddressForm from "@/features/account/components/AddressForm";
import { savedAddresses } from "@/lib/mock/account";
import type { Address, AddressInput } from "@/types/address";

type Dialog =
  | { mode: "create" }
  | { mode: "edit"; address: Address }
  | { mode: "delete"; address: Address }
  | null;

/** Guarantees one default when addresses exist: the first one takes over if the default is removed. */
function ensureDefault(list: Address[]) {
  if (list.length === 0 || list.some((address) => address.isDefault)) return list;
  return list.map((address, index) => ({ ...address, isDefault: index === 0 }));
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(savedAddresses);
  const [dialog, setDialog] = useState<Dialog>(null);

  const close = () => setDialog(null);

  function saveAddress(input: AddressInput, id?: number) {
    setAddresses((current) => {
      const targetId = id ?? Math.max(0, ...current.map((address) => address.id)) + 1;
      const saved: Address = { ...input, id: targetId };
      const list = id === undefined ? [...current, saved] : current.map((address) => (address.id === id ? saved : address));

      // A new default demotes every other address.
      const withDefault = input.isDefault
        ? list.map((address) => ({ ...address, isDefault: address.id === targetId }))
        : list;
      return ensureDefault(withDefault);
    });
    close();
  }

  function removeAddress(id: number) {
    setAddresses((current) => ensureDefault(current.filter((address) => address.id !== id)));
    close();
  }

  function setDefault(id: number) {
    setAddresses((current) => current.map((address) => ({ ...address, isDefault: address.id === id })));
  }

  return (
    <AccountShell>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Account", to: "/account" }, { label: "Addresses" }]} />
      <PageHeader
        eyebrow="ADDRESS BOOK"
        title="Saved addresses"
        description="Manage delivery details for a faster checkout."
        action={
          addresses.length > 0 ? (
            <Button variant="ghost" onClick={() => setDialog({ mode: "create" })}>
              <Icon name="plus" size={14} />
              Add address
            </Button>
          ) : undefined
        }
      />

      {addresses.length === 0 ? (
        <div className="grid place-items-center gap-4 rounded-hm-md border border-dashed border-hm-border px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-hm-field">
            <Icon name="plus" size={18} />
          </span>
          <p className="m-0 text-[13px] text-hm-muted">No saved addresses yet. Add one to check out faster.</p>
          <Button variant="ghost" size="sm" onClick={() => setDialog({ mode: "create" })}>
            Add address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => setDialog({ mode: "edit", address })}
              onDelete={() => setDialog({ mode: "delete", address })}
              onSetDefault={() => setDefault(address.id)}
            />
          ))}
        </div>
      )}

      {dialog?.mode === "create" && (
        <Modal title="New address" eyebrow="ADDRESS BOOK" onClose={close}>
          <AddressForm onSubmit={(value) => saveAddress(value)} onCancel={close} />
        </Modal>
      )}

      {dialog?.mode === "edit" && (
        <Modal title="Edit address" eyebrow="ADDRESS BOOK" onClose={close}>
          <AddressForm
            initial={dialog.address}
            onSubmit={(value) => saveAddress(value, dialog.address.id)}
            onCancel={close}
          />
        </Modal>
      )}

      {dialog?.mode === "delete" && (
        <Modal title="Delete this address?" eyebrow="ADDRESS BOOK" onClose={close} className="max-w-[440px]">
          <p className="m-0 text-[13px] leading-[1.7] text-hm-muted">
            <span className="font-[650] text-hm-text">{dialog.address.label}</span> at {dialog.address.line1} will be
            removed from your address book. Past orders keep their delivery details.
          </p>
          <div className="mt-8 flex justify-end gap-3 max-[480px]:flex-col-reverse">
            <Button variant="quiet" size="sm" onClick={close} className="max-[480px]:w-full">
              Cancel
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeAddress(dialog.address.id)}
              className="text-hm-error hover:bg-hm-error-soft max-[480px]:w-full"
            >
              Delete address
            </Button>
          </div>
        </Modal>
      )}

      {addresses.length === 0 && (
        <p className="mt-8 text-[12px] text-hm-muted">
          Looking for something to buy?{" "}
          <Link to="/products" className={buttonClasses({ variant: "link", size: "sm" })}>
            Browse products
          </Link>
        </p>
      )}
    </AccountShell>
  );
}
