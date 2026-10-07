import { AnimatePresence } from "framer-motion";
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
import { useAddresses, useCreateAddress, useDeleteAddress, useUpdateAddress } from "@/features/account/api";
import type { Address, AddressInput } from "@/types/address";

type Dialog =
  | { mode: "create" }
  | { mode: "edit"; address: Address }
  | { mode: "delete"; address: Address }
  | null;

export default function AddressesPage() {
  const { data: addresses, isPending, isError, refetch } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const [dialog, setDialog] = useState<Dialog>(null);

  const close = () => setDialog(null);
  const isSaving = createAddress.isPending || updateAddress.isPending;

  function saveAddress(input: AddressInput, id?: string) {
    const mutation = id ? updateAddress.mutateAsync({ id, payload: input }) : createAddress.mutateAsync(input);
    mutation.then(close).catch(() => {});
  }

  function removeAddress(id: string) {
    deleteAddress
      .mutateAsync(id)
      .then(close)
      .catch(() => {});
  }

  function setDefault(address: Address) {
    updateAddress.mutate({
      id: address.id,
      payload: {
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        country: address.country,
        zipCode: address.zipCode,
        isDefault: true,
      },
    });
  }

  return (
    <AccountShell>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Account", to: "/account" }, { label: "Addresses" }]} />
      <PageHeader
        eyebrow="ADDRESS BOOK"
        title="Saved addresses"
        description="Manage delivery details for a faster checkout."
        action={
          addresses && addresses.length > 0 ? (
            <Button variant="ghost" onClick={() => setDialog({ mode: "create" })}>
              <Icon name="plus" size={14} />
              Add address
            </Button>
          ) : undefined
        }
      />

      {isPending ? (
        <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
          {[0, 1].map((key) => (
            <div key={key} className="h-[220px] animate-pulse rounded-hm-md border border-hm-border bg-hm-field" />
          ))}
        </div>
      ) : isError ? (
        <div className="grid place-items-center gap-4 rounded-hm-md border border-dashed border-hm-border px-6 py-16 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load your addresses. Please try again.</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : addresses.length === 0 ? (
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
              onSetDefault={() => setDefault(address)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {dialog?.mode === "create" && (
          <Modal key="create" title="New address" eyebrow="ADDRESS BOOK" onClose={close}>
            <AddressForm onSubmit={(value) => saveAddress(value)} onCancel={close} isSubmitting={isSaving} />
          </Modal>
        )}

        {dialog?.mode === "edit" && (
          <Modal key="edit" title="Edit address" eyebrow="ADDRESS BOOK" onClose={close}>
            <AddressForm
              initial={dialog.address}
              onSubmit={(value) => saveAddress(value, dialog.address.id)}
              onCancel={close}
              isSubmitting={isSaving}
            />
          </Modal>
        )}

        {dialog?.mode === "delete" && (
          <Modal key="delete" title="Delete this address?" eyebrow="ADDRESS BOOK" onClose={close} className="max-w-[440px]">
            <p className="m-0 text-[13px] leading-[1.7] text-hm-muted">
              <span className="font-[650] text-hm-text">{dialog.address.addressLine}</span> will be removed from your
              address book. Past orders keep their delivery details.
            </p>
            <div className="mt-8 flex justify-end gap-3 max-[480px]:flex-col-reverse">
              <Button variant="quiet" size="sm" onClick={close} className="max-[480px]:w-full">
                Cancel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={deleteAddress.isPending}
                onClick={() => removeAddress(dialog.address.id)}
                className="text-hm-error hover:bg-hm-error-soft max-[480px]:w-full"
              >
                {deleteAddress.isPending ? "Deleting…" : "Delete address"}
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {!isPending && !isError && addresses.length === 0 && (
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
