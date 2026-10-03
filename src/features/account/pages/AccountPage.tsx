import { useState } from "react";
import { NavLink } from "react-router";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Input from "@/components/Input";
import PageHeader from "@/components/PageHeader";
import { cn } from "@/lib/cn";

const navigation = [
  { to: "/account", label: "Profile", end: true },
  { to: "/account/addresses", label: "Addresses", end: true },
  { to: "/orders", label: "Orders", end: false },
  { to: "#", label: "Notifications", end: false },
];

const savedAddresses = ["Home", "Office", "Family"];

export default function AccountPage({ addresses = false }: { addresses?: boolean }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="grid grid-cols-[200px_1fr] gap-[70px] max-[600px]:grid-cols-1">
      <aside className="flex flex-col pt-20 max-[600px]:flex-row max-[600px]:overflow-auto max-[600px]:pt-5">
        {navigation.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "p-3 text-hm-muted no-underline max-[600px]:min-w-max",
                isActive && item.to !== "#" && "rounded-[10px] bg-hm-text text-white",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
        <NavLink to="/login" className="p-3 text-hm-muted no-underline max-[600px]:min-w-max">
          Logout
        </NavLink>
      </aside>

      <section>
        {addresses ? (
          <>
            <PageHeader
              eyebrow="ADDRESS BOOK"
              title="Saved addresses"
              description="Manage delivery details for a faster checkout."
            />
            <Button variant="ghost">+ Add Address</Button>
            <div className="my-[22px] grid grid-cols-2 gap-3.5 max-[600px]:grid-cols-1">
              {savedAddresses.map((label, index) => (
                <article
                  key={label}
                  className="min-h-[260px] rounded-[14px] border border-hm-border bg-hm-surface p-[22px] text-left"
                >
                  {index === 0 && <b>Default</b>}
                  <h2 className="text-[16px] font-normal">{label}</h2>
                  <p className="text-[11px] leading-[1.7] text-hm-muted">
                    Amara Okafor
                    <br />
                    18 Adebayo Doherty Road
                    <br />
                    Lagos, Nigeria
                    <br />
                    +234 803 456 7890
                  </p>
                  <div className="flex gap-2">
                    <Button variant="ghost">Edit</Button>
                    <Button variant="ghost">Delete</Button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <>
            <PageHeader
              eyebrow="PROFILE"
              title="Personal details"
              description="Keep your information current."
            />
            <div className="mb-[30px] grid size-[100px] place-items-center rounded-full bg-[#eae9fb] text-[24px] font-bold text-hm-accent">
              AO
            </div>
            <Field label="Full name" className="my-[18px] max-w-[600px] text-[11px] font-normal">
              <Input className="h-[50px] px-[15px]" defaultValue="Amara Okafor" />
            </Field>
            <Field label="Email address" className="my-[18px] max-w-[600px] text-[11px] font-normal">
              <Input className="h-[50px] px-[15px]" defaultValue="amara.okafor@example.com" readOnly />
            </Field>
            <Button onClick={() => setSaved(true)}>Save Changes</Button>
            {saved && <small className="ml-3">Changes saved</small>}
          </>
        )}
      </section>
    </div>
  );
}
