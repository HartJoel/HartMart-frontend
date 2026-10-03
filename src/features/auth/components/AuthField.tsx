import Field from "@/components/Field";
import Input from "@/components/Input";
import type { InputHTMLAttributes } from "react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

/** Auth-specific input: taller, with hover and focus states. */
export default function AuthField({ label, ...props }: AuthFieldProps) {
  return (
    <Field label={label}>
      <Input
        {...props}
        className="h-[52px] border border-transparent px-4 text-[14px] transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-[#a1a1aa] hover:bg-[#f0f0f1] focus:border-hm-accent focus:bg-hm-surface focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)]"
      />
    </Field>
  );
}
