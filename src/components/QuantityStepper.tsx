import IconButton from "@/components/IconButton";

type QuantityStepperProps = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export default function QuantityStepper({ value, onDecrease, onIncrease }: QuantityStepperProps) {
  return (
    <div className="flex h-12 items-center rounded-hm-sm bg-hm-field p-1">
      <IconButton tone="raised" label="Decrease quantity" onClick={onDecrease}>
        −
      </IconButton>
      <span className="min-w-7 text-center text-[10px]">{value}</span>
      <IconButton tone="raised" label="Increase quantity" onClick={onIncrease}>
        +
      </IconButton>
    </div>
  );
}
