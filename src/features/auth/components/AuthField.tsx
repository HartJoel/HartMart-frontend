import { useState, type InputHTMLAttributes } from "react";
import Field from "@/components/Field";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import { cn } from "@/lib/cn";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

/** Auth-specific input: taller, with hover and focus states. Password fields get a show/hide toggle. */
export default function AuthField({ label, type, className, ...props }: AuthFieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <Field label={label}>
      <div className="relative">
        <Input
          {...props}
          type={isPassword && visible ? "text" : type}
          className={cn(
            "h-[52px] border border-transparent px-4 text-[14px] transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-[#a1a1aa] hover:bg-[#f0f0f1] focus:border-hm-accent focus:bg-hm-surface focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)]",
            isPassword && "pr-11",
            className,
          )}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-hm-muted transition-colors hover:text-hm-text"
          >
            <Icon name={visible ? "eyeOff" : "eye"} size={18} />
          </button>
        )}
      </div>
    </Field>
  );
}
