import Button from "@/components/Button";
import Icon, { type IconName } from "@/components/Icon";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/cn";
import type { Address } from "@/types/address";

type AddressCardProps = {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
};

export default function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <article className="flex min-h-[220px] flex-col rounded-hm-md border border-hm-border bg-hm-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="m-0 text-[15px] font-[650]">{address.addressLine}</h3>
          {address.isDefault && <StatusBadge tone="neutral">Default</StatusBadge>}
        </div>
        <div className="flex shrink-0 gap-1">
          <IconButton icon="edit" label="Edit address" onClick={onEdit} />
          <IconButton icon="trash" label="Delete address" onClick={onDelete} danger />
        </div>
      </div>

      <address className="mt-4 text-[12px] leading-[1.7] text-hm-muted not-italic">
        {address.city}, {address.state} {address.zipCode}
        <br />
        {address.country}
      </address>

      {!address.isDefault && (
        <Button variant="link" onClick={onSetDefault} className="mt-auto self-start pt-5">
          Set as default
        </Button>
      )}
    </article>
  );
}

function IconButton({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "grid size-9 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-hm-muted transition-colors duration-200 hover:bg-hm-field",
        danger ? "hover:text-hm-error" : "hover:text-hm-text",
      )}
    >
      <Icon name={icon} size={16} />
    </button>
  );
}
