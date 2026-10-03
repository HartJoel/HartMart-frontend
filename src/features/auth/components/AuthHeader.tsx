type AuthHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function AuthHeader({ eyebrow, title, description }: AuthHeaderProps) {
  return (
    <div className="text-center">
      <div className="mb-4 text-[11px] font-bold tracking-[0.14em] text-hm-accent">{eyebrow}</div>
      <h1 className="text-[32px] leading-[1.08] font-[600] tracking-[-0.045em] max-[520px]:text-[28px]">{title}</h1>
      <p className="mx-auto mt-4 text-[14px] leading-[1.6] text-hm-muted">{description}</p>
    </div>
  );
}
