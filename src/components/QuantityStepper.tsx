type QuantityStepperProps = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export default function QuantityStepper({ value, onDecrease, onIncrease }: QuantityStepperProps) {
  return (
    <div className="flex h-12 items-center rounded-hm-sm bg-hm-field p-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={onDecrease}
        className="size-[34px] rounded-full border-0 bg-transparent"
      >
        −
      </button>
      <span className="min-w-7 text-center text-[10px]">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={onIncrease}
        className="size-[34px] rounded-full border-0 bg-transparent"
      >
        +
      </button>
    </div>
  );
}
